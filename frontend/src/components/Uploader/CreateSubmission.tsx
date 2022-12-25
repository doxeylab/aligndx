import BasePlugin from '@uppy/core/lib/BasePlugin.js'
import axios from 'axios'
import { apiClient } from '../../api/Config'

export default class CreateSubmission extends BasePlugin {
  constructor(uppy, opts) {
    super(uppy, opts)
    this.pipeline = opts.pipeline
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

      let result = axios.post(`http://localhost:8080/uploads/start`, data, config)
        .then((response) => {
          console.log(response.data['sub_id'])
          return response.data['sub_id']
        })
        .catch((error) => {
          console.log('there was an error')
          let refreshResult = apiClient.get('users/refresh', { withCredentials: true }).then((response) => {
            return apiClient.post(`uploads/start`, data, {
              headers: {
                Authorization: `Bearer ${response.data['access_token']}`
              }
            }).then((response) => {
              return response.data['sub_id']
            }).catch((error) => {
              this.uppy.cancelUploads()
            })
          })
          return refreshResult
        })
      return result
    }

    let subId = await createSubId()

    const createAndApplySubId = async (fileID, subId) => {
      this.uppy.setFileMeta(fileID, { ...this.uppy.meta, subId })
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
      // return this.uppy.setFileMeta(fileID, { 'sub_id': sub_id }).then((file) => {
      //   this.uppy.log(`[Create Submission] Set Meta`)
      // }).catch((err) => {
      //   this.uppy.log(`[Create Submission] Failed to set Meta:`, 'warning')
      //   this.uppy.log(err, 'warning')
      // })
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

