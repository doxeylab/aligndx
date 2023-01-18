import BasePlugin from '@uppy/core/lib/BasePlugin.js'
import axios from 'axios'
import { apiClient } from '../../api/Config'
import { BASE_URL } from "../../config/Settings"

export default class CreateSubmission extends BasePlugin {
  constructor(uppy, opts) {
    super(uppy, opts)
    this.pipeline = opts.pipeline
    this.refresh = opts.refresh
    this.updateParentSubId = opts.updateParentSubId

    this.id = opts.id || 'CreateSubmission'
    this.type = 'modifier'
    this.defaultLocale = {
      strings: {
        creatingSubmission: 'Creating Submission...',
      },
    }
    this.i18nInit()
  }

  prepareUpload = async (fileIDs) => {
    const items = this.uppy.getFiles()
    const names = items.map(object => object.name)

    const createSubId = async () => {
      const parse = (value: string | null) => {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }

      const stored = parse(localStorage.getItem('auth'))
      const token = stored['accessToken']

      let data = {
        "items": names,
        'pipeline': this.pipeline
      }

      let config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      let result = axios.post(`${BASE_URL}/uploads/start`, data, config)
        .then((response) => {
          let subId = response.data['sub_id']
          this.updateParentSubId(subId)
          return subId
        })
        .catch(async (error) => {
          let newToken = await this.refresh()
          let config = {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
          let refreshResult = axios.post(`${BASE_URL}/uploads/start`, data, config).then((response) => {
            let subId = response.data['sub_id']
            this.updateParentSubId(subId)
            return subId
          })
          return refreshResult
        })
      return result
    }

    let subId = await createSubId()

    const createAndApplySubId = async (fileID, subId) => {
      this.uppy.log(`[Create Submission] Setting Submission Meta`)
      this.uppy.setFileMeta(fileID, { subId: subId })
    }

    const promises = fileIDs.map(async (fileID) => {
      const file = this.uppy.getFile(fileID)
      this.uppy.emit('preprocess-progress', file, {
        mode: 'indeterminate',
        message: this.i18n('creatingSubmission'),
      })

      if (file.isRemote) {
        return Promise.resolve()
      }

      if (!file.data.type) {
        file.data = file.data.slice(0, file.data.size, file.type)
      }

      return createAndApplySubId(fileID, subId)
    })

    const emitPreprocessCompleteForAll = () => {
      fileIDs.forEach((fileID) => {
        const file = this.uppy.getFile(fileID)
        this.uppy.emit('preprocess-complete', file)
      })
    }

    // Why emit `preprocess-complete` for all files at once, instead of
    // above when each is processed?
    // Because it leads to StatusBar showing a weird “upload 6 files” button,
    // while waiting for all the files to complete pre-processing.
    return Promise.all(promises)
      .then(emitPreprocessCompleteForAll)
  }

  install() {
    this.uppy.addPreProcessor(this.prepareUpload)
  }

  uninstall() {
    this.uppy.removePreProcessor(this.prepareUpload)
  }
}

