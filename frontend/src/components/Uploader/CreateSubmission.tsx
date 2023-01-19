/* eslint-disable */
import { BasePlugin, PluginOptions } from '@uppy/core'
import axios from 'axios'
// @ts-ignore
import { BASE_URL } from "../../config/Settings"

interface CreateSubmissionOptions extends PluginOptions {
    meta: any;
    createSubmission: any;
    refresh: any;
    updateParentSubId: any;
}

export default class CreateSubmission extends BasePlugin<CreateSubmissionOptions> {
  public meta: any;
  public refresh: any;
  public updateParentSubId: any;
  public id: any;
  public type: any;
  public defaultLocale: any;
  public i18nInit: any;
  public uppy: any;

  public constructor(uppy : any, opts: any ) {
    super(uppy, opts)
    this.meta = opts.meta
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

  prepareUpload = async (fileIDs: string[]) => {
    const items = this.uppy.getFiles()
    const names = items.map((object: any) => object.name)

    const createSubId = async () => {
      const parse = (value: string) => {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }

      const stored = parse(localStorage.getItem('auth') || '{}')
      const token = stored['accessToken']

      const data = {
        "items": names,
        'pipeline': this.meta['pipeline'],
        'name': this.meta['name']
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const result = axios.post(`${BASE_URL}/uploads/start`, data, config)
        .then((response: any) => {
          const subId = response.data['sub_id']
          this.updateParentSubId(subId)
          return subId
        })
        .catch(async (error: any) => {
          const newToken = await this.refresh()
          const config = {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
          const refreshResult = axios.post(`${BASE_URL}/uploads/start`, data, config).then((response : any) => {
            const subId = response.data['sub_id']
            this.updateParentSubId(subId)
            return subId
          })
          return refreshResult
        })
      return result
    }

    const subId = await createSubId()

    const createAndApplySubId = async (fileID : string, subId : string ) => {
      this.uppy.log(`[Create Submission] Setting Submission Meta`)
      this.uppy.setFileMeta(fileID, { subId: subId })
    }

    const promises = fileIDs.map(async (fileID) => {
      const file = this.uppy.getFile(fileID)
      this.uppy.emit('preprocess-progress', file, {
        mode: 'indeterminate',
        message: this.i18nInit('creatingSubmission'),
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

