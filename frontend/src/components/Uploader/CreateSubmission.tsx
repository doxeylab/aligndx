import BasePlugin from '@uppy/core/lib/BasePlugin.js'
import { apiClient } from '../../api/Config'

export default class CreateSubmission extends BasePlugin {
  constructor(uppy, opts) {
    super(uppy, opts)
    this.pipeline = opts.pipeline
    this.refresh = opts.refresh
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
    const parse = (value: string | null) => {
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    }

    const stored = parse(localStorage.getItem('auth'))
    const token = stored['accessToken']

    const sendStart = async(token : any) => {
      let data = {
        "items": names,
        'pipeline': this.pipeline
      }
  
  
      let config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      apiClient.post(`uploads/start`, data, config).then((response) => {
        return response.data['sub_id']
      })
      .catch((error) => {
        apiClient.get('users/refresh',{withCredentials: true}).then((response) => {
          return response.data['accessToken'] 
        })
        return error
      })
    }

    let sub_id = await sendStart(token)

    const promises = fileIDs.map((fileID) => {
      const file = this.uppy.getFile(fileID)
      this.uppy.emit('preprocess-progress', file, {
        mode: 'indeterminate',
        message: this.i18n('creatingSubmission'),
      })

      return this.uppy.setFileMeta(fileID, { 'sub_id': sub_id }).then((file) => {
        this.uppy.log(`[Create Submission] Set Meta`)
      }).catch((err) => {
        this.uppy.log(`[Create Submission] Failed to set Meta:`, 'warning')
        this.uppy.log(err, 'warning')
      })
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

