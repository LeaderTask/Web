<template>
  <!-- Pic -->
  <span
    v-if="pics.includes(file.file_name.split('.').pop())"
    class="inline-block w-full"
  >
    <a
      :id="'img_' + file.uid"
      :href="'https://web.leadertask.com/User/Files/GetFile?uid=' + file.uid"
      target="_blank"
    >
      <ChatLoader
        v-if="!isImageLoaded"
        width="250px"
        height="150px"
        align="center"
      />
    </a>
  </span>

  <!-- Movie -->
  <span v-if="movies.includes(file.file_name.split('.').pop())">
    {{ getMovUrl(file.uid, file.file_name.split('.').pop(), file.file_name) }}
    <a
      :id="'video_' + file.uid"
      :href="
        'https://web.leadertask.com/User/Files/GetFile?uid=' + file.uid
      "
      target="_blank"
    >
      <svg
        width="22"
        height="27"
        viewBox="0 0 74 89"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M73.5 25.4C73.6 25.5 73.7 25.7 73.8 25.9C73.9 26.2 74 26.6 74 27V82C74 85.9 70.9 89 67 89H7C3.1 89 0 85.9 0 82V7C0 3.1 3.1 0 7 0H47C47.4 0 47.8 0.1 48 0.2H48.1C48.2 0.25 48.275 0.3 48.35 0.35C48.425 0.4 48.5 0.45 48.6 0.5C48.8 0.6 49 0.8 49.1 0.9L73.1 24.9L73.1001 24.9001C73.3 25.1 73.4 25.2 73.5 25.4ZM7 6C6.4 6 6 6.4 6 7V82C6 82.6 6.4 83 7 83H67C67.6 83 68 82.6 68 82V30H51C47.1 30 44 26.9 44 23V6H7ZM50 23C50 23.6 50.4 24 51 24H63.8L50 10.2V23ZM46.4104 41.044H52.3538C55.4245 41.044 58 43.5165 58 46.6813V66.3626C58 69.6264 54.7311 72 51.8585 72H21.6462C18.5755 72 16 69.5275 16 66.3626V46.6813C16 43.5165 18.5755 41.044 21.6462 40.9451H27.1934L28.184 39.1648C29.0755 37.2857 31.0566 36 33.2358 36H40.6651C42.8443 36 44.8255 37.3846 45.816 39.5604L46.4104 41.044ZM51.8585 67.3516C52.6509 67.3516 53.2453 66.6593 53.2453 66.3626V46.7802C53.2453 46.2857 52.9481 45.7912 52.3538 45.7912H44.8255C44.033 45.7912 43.1415 45.1978 42.7453 44.3077L41.4575 41.3407C41.3585 40.9451 41.0613 40.7473 40.6651 40.7473H33.2358C32.8396 40.7473 32.6415 40.9451 32.3443 41.2418L30.7594 44.4066C30.4623 45.1978 29.5708 45.6923 28.6792 45.6923H21.6462C21.25 45.6923 20.7547 46.0879 20.7547 46.6813V66.3626C20.7547 66.8571 21.0519 67.3516 21.6462 67.3516H51.8585ZM26.7972 55.5824C26.7972 49.9451 31.3538 45.3956 37 45.3956C42.6462 45.3956 47.2028 49.9451 47.2028 55.5824C47.2028 61.2198 42.6462 65.7692 37 65.7692C31.2547 65.7692 26.7972 61.3187 26.7972 55.5824ZM31.5519 55.5824C31.5519 58.6483 34.0283 61.1209 37 61.1209C39.9717 61.1209 42.4481 58.6483 42.4481 55.5824C42.4481 52.5165 39.9717 50.044 37 50.044C34.0283 50.044 31.5519 52.5165 31.5519 55.5824Z"
          fill="#757575"
        />
      </svg>
    </a>
  </span>

  <!-- Docs -->
  <span
    v-if="docs.includes(file.file_name.split('.').pop())"
    class="flex mr-1"
  >
    <a
      :id="'doc_' + file.uid"
      target="_blank"
      download
      @click="getDocUrl(file.uid, file.file_name.split('.').pop(), file.file_name)"
    >
      <svg
        v-if="file.file_name.split('.').pop() === 'pdf'"
        width="22"
        height="27"
        viewBox="0 0 74 89"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M73.5 25.4C73.6 25.5 73.7 25.7 73.8 25.9C73.9 26.2 74 26.6 74 27V82C74 85.9 70.9 89 67 89H7C3.1 89 0 85.9 0 82V7C0 3.1 3.1 0 7 0H47C47.4 0 47.8 0.1 48 0.2H48.1C48.2 0.25 48.275 0.3 48.35 0.35C48.425 0.4 48.5 0.45 48.6 0.5C48.8 0.6 49 0.8 49.1 0.9L73.1 24.9L73.1001 24.9001C73.3 25.1 73.4 25.2 73.5 25.4ZM7 6C6.4 6 6 6.4 6 7V82C6 82.6 6.4 83 7 83H67C67.6 83 68 82.6 68 82V30H51C47.1 30 44 26.9 44 23V6H7ZM50 23C50 23.6 50.4 24 51 24H63.8L50 10.2V23ZM45.3787 51.6342C47.6615 51.2192 49.3217 51.0636 49.9442 51.0636C52.0195 51.0636 56.9481 51.0636 57 55.4734C57 57.2374 56.2737 60.2464 51.6044 60.2464C50.2555 60.2464 47.8171 58.8975 44.2892 56.1997C41.799 56.6667 37.3372 57.6005 33.6537 59.0532C30.4371 65.4864 25.8716 69.9481 22.3956 69.9481C19.8016 69.9481 17 68.2879 17 65.642C17 62.1161 20.5239 60.4558 25.9143 57.9161L25.9235 57.9118H25.9754C27.1167 57.393 28.31 56.8223 29.5551 56.1997L30.489 55.7328C30.9559 54.7471 31.3709 53.6576 31.7341 52.5681L32.1492 51.2711C32.2014 51.1099 32.2533 50.9498 32.3049 50.7909C32.8672 49.0567 33.386 47.4569 33.8612 46.0311C31.2672 42.607 29.9702 39.6498 29.9702 37.1595C29.9702 30.9339 33.3424 30 35.3658 30C39.2049 30 40.7613 32.0233 40.7613 37.0039C40.7613 38.249 40.2425 40.3243 38.6861 45.1492C39.5681 46.2387 40.6057 47.3281 41.7471 48.4695C42.5772 49.2996 43.8742 50.441 45.3787 51.6342ZM50.8199 55.4797C51.2764 55.7296 51.5781 55.8948 51.7601 55.9403C52.3332 55.9403 52.551 55.8757 52.6429 55.8485C52.6674 55.8412 52.683 55.8366 52.6939 55.8366V55.6291C52.5383 55.5253 52.0713 55.4215 50.6187 55.3697C50.6889 55.4079 50.7559 55.4447 50.8199 55.4797ZM36.4553 37.0558C36.4553 34.3061 36.2477 34.3061 35.3658 34.3061C34.9507 34.3061 34.2763 34.3061 34.2244 37.2114C34.2244 38.1453 34.6913 39.3904 35.5214 40.8431C35.9364 39.546 36.4553 37.6783 36.4553 37.0558ZM35.8327 53.7613C37.1297 53.3982 38.5305 53.035 40.035 52.6719C39.3606 52.1012 38.8936 51.6861 38.738 51.4786C38.4459 51.1864 38.1673 50.8943 37.8954 50.6091C37.6361 50.3372 37.3829 50.0716 37.1297 49.8184C36.8184 50.8041 35.8327 53.7613 35.8327 53.7613ZM21.358 65.4864C21.5655 65.5901 21.9287 65.6939 22.3956 65.6939C22.9144 65.6939 24.5746 64.7082 26.4423 62.4254C24.3671 63.463 21.8249 64.7601 21.358 65.4864Z"
          fill="#757575"
        />
      </svg>
      <svg
        v-else
        width="22"
        height="27"
        viewBox="0 0 22 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M21.6459 8.28333C21.675 8.3125 21.7042 8.37083 21.7334 8.42917C21.7625 8.51667 21.7917 8.63333 21.7917 8.75V24.7917C21.7917 25.9292 20.8875 26.8333 19.75 26.8333H2.25004C1.11254 26.8333 0.208374 25.9292 0.208374 24.7917V2.91667C0.208374 1.77917 1.11254 0.875 2.25004 0.875H13.9167C14.0334 0.875 14.15 0.904167 14.2084 0.933333H14.2375C14.2667 0.947917 14.2886 0.9625 14.3105 0.977083C14.3323 0.991667 14.3542 1.00625 14.3834 1.02083C14.4417 1.05 14.5 1.10833 14.5292 1.1375L21.5292 8.1375L21.5292 8.13751C21.5875 8.19584 21.6167 8.225 21.6459 8.28333ZM2.25004 2.625C2.07504 2.625 1.95837 2.74167 1.95837 2.91667V24.7917C1.95837 24.9667 2.07504 25.0833 2.25004 25.0833H19.75C19.925 25.0833 20.0417 24.9667 20.0417 24.7917V9.625H15.0834C13.9459 9.625 13.0417 8.72083 13.0417 7.58333V2.625H2.25004ZM14.7917 7.58333C14.7917 7.75833 14.9084 7.875 15.0834 7.875H18.8167L14.7917 3.85V7.58333ZM5.22504 11.375C4.70957 11.375 4.29171 11.7929 4.29171 12.3083C4.29171 12.8238 4.70957 13.2417 5.22504 13.2417H16.4834C16.9988 13.2417 17.4167 12.8238 17.4167 12.3083C17.4167 11.7929 16.9988 11.375 16.4834 11.375H5.22504ZM4.29171 9.1C4.29171 8.58453 4.70957 8.16667 5.22504 8.16667H10.65C11.1655 8.16667 11.5834 8.58453 11.5834 9.1C11.5834 9.61547 11.1655 10.0333 10.65 10.0333H5.22504C4.70957 10.0333 4.29171 9.61547 4.29171 9.1ZM5.22504 14.5833C4.70957 14.5833 4.29171 15.0012 4.29171 15.5167C4.29171 16.0321 4.70957 16.45 5.22504 16.45H16.4834C16.9988 16.45 17.4167 16.0321 17.4167 15.5167C17.4167 15.0012 16.9988 14.5833 16.4834 14.5833H5.22504ZM4.29171 18.725C4.29171 18.2095 4.70957 17.7917 5.22504 17.7917H16.4834C16.9988 17.7917 17.4167 18.2095 17.4167 18.725C17.4167 19.2405 16.9988 19.6583 16.4834 19.6583H5.22504C4.70957 19.6583 4.29171 19.2405 4.29171 18.725ZM5.22504 21C4.70957 21 4.29171 21.4179 4.29171 21.9333C4.29171 22.4488 4.70957 22.8667 5.22504 22.8667H16.4834C16.9988 22.8667 17.4167 22.4488 17.4167 21.9333C17.4167 21.4179 16.9988 21 16.4834 21H5.22504Z"
          fill="#757575"
        />
      </svg>
    </a>
  </span>

  <!-- Audio -->
  <span v-if="audio.includes(file.file_name.split('.').pop())">
    {{ getAudioUrl(file.uid, file.file_name.split('.').pop(), file.file_name) }}
    <audio
      :id="'audio_' + file.uid"
      ref="audioPlayer"
      :src="'https://web.leadertask.com/User/Files/GetFile?uid=' + uid"
      controls
    >
      Your browser does not support the
      <code>audio</code> element.
    </audio>
  </span>

  <!-- Anything else -->
  <span
    v-else
    class="flex mr-1"
  >
    <a
      :id="'any_' + file.uid"
      target="_blank"
      download
      @click="getAnyUrl( file.uid, file.file_name.split('.').pop(), file.file_name)"
    >
      <svg
        v-if="
          !docs.includes(file.file_name.split('.').pop()) &&
            !audio.includes(file.file_name.split('.').pop()) &&
            !movies.includes(file.file_name.split('.').pop()) &&
            !pics.includes(file.file_name.split('.').pop())
        "
        width="22"
        height="27"
        viewBox="0 0 74 89"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M73.5 25.4C73.6 25.5 73.7 25.7 73.8 25.9C73.9 26.2 74 26.6 74 27V82C74 85.9 70.9 89 67 89H7C3.1 89 0 85.9 0 82V7C0 3.1 3.1 0 7 0H47C47.4 0 47.8 0.1 48 0.2H48.1C48.2 0.25 48.275 0.3 48.35 0.35C48.425 0.4 48.5 0.45 48.6 0.5C48.8 0.6 49 0.8 49.1 0.9L73.1 24.9L73.1001 24.9001C73.3 25.1 73.4 25.2 73.5 25.4ZM7 6C6.4 6 6 6.4 6 7V82C6 82.6 6.4 83 7 83H67C67.6 83 68 82.6 68 82V30H51C47.1 30 44 26.9 44 23V6H7ZM50 23C50 23.6 50.4 24 51 24H63.8L50 10.2V23ZM37 21.2804C37 22.1302 36.2927 22.8642 35.389 22.8642H29.2593V29.5861H35.389C36.2534 29.5861 37 30.2815 37 31.17V34.6854C37 35.5353 36.2927 36.2693 35.389 36.2693H29.2593V42.9525H35.3497C36.2141 42.9525 36.9607 43.6479 36.9607 44.5364V48.0519C36.9607 48.9018 36.2534 49.6358 35.3497 49.6358H26.3517C25.4872 49.6358 24.7407 48.9404 24.7407 48.0519V42.9525H18.611C17.7466 42.9525 17 42.2572 17 41.3687V37.8532C17 36.9647 17.7466 36.2693 18.611 36.2693H24.7407V29.5088H18.611C17.7466 29.5088 17 28.8135 17 27.9249V24.4095C17 23.5596 17.7073 22.8256 18.611 22.8256H24.7407V16.1038H18.611C17.7466 16.1038 17 15.4084 17 14.5199V10H29.2593V16.181H35.389C36.2534 16.181 37 16.8764 37 17.7649V21.2804ZM30.9097 55.7395V63.9294L33.4244 71.192C34.1317 73.2395 33.778 75.4801 32.5207 77.2185C31.2633 78.957 29.1808 80 27.0197 80C24.8586 80 22.7761 78.957 21.5187 77.2185C20.2613 75.4801 19.9077 73.2009 20.615 71.192L23.1297 63.9294V55.7395C23.1297 54.8896 23.837 54.1556 24.7407 54.1556H29.2987C30.1631 54.1556 30.9097 54.851 30.9097 55.7395ZM24.1906 75.3256C25.4873 77.1027 28.5521 77.1027 29.8488 75.3256C30.5167 74.4371 30.6739 73.2782 30.281 72.2351L29.4558 69.8013H24.5442L23.7191 72.2351C23.3655 73.2782 23.5226 74.4371 24.1906 75.3256Z"
          fill="#757575"
        />
      </svg>
    </a>
  </span>
</template>

<script>
import { GET_FILE } from '@/store/actions/taskfiles'
import { writeCache } from '@/store/helpers/functions'

export default {
  props: {
    file: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['setLink'],
  data () {
    return {
      pics: [
        'jpg',
        'png',
        'jpeg',
        'git',
        'bmp',
        'gif',
        'PNG',
        'JPG',
        'JPEG',
        'BMP',
        'GIF'
      ],
      movies: ['mov', 'mp4', 'wmv', 'avi', 'avchd', 'mkv', 'webm', 'mpeg-2'],
      docs: ['doc', 'docx', 'xls', 'xlsx', 'txt', 'pdf'],
      audio: ['mp3', 'wav', 'm4a'],
      isImageLoaded: false
    }
  },
  mounted () {
    if (this.pics.includes(this.file.file_name.split('.').pop())) {
      this.getImgUrl(
        this.file.uid,
        this.file.file_name.split('.').pop(),
        this.file.file_name,
        0
      )
    }
    if (this.docs.includes(this.file.file_name.split('.').pop())) {
      this.getDocUrl(
        this.file.uid,
        this.file.file_name.split('.').pop(),
        this.file.file_name
      )
    }
  },
  methods: {
    b64toBlob: (base64) => fetch(base64).then((res) => res.blob()),
    getImgUrl (uid, extension, filename, counter) {
      // computed value triggered after template change
      if (this.isImageLoaded) return
      const cachedImageBase64 = localStorage.getItem(uid)
      if (cachedImageBase64) {
        // we nee to wait until hidden messages will be drawn
        this.$nextTick(() => {
          this.b64toBlob(cachedImageBase64).then((blobImage) => {
            // убираем дублирование при обновлении текущей задачи
            // если процесс в фоне (получается что запускается одновременно два и более)
            if (document.getElementById('img_' + uid)?.getElementsByTagName('img')?.length) {
              this.isImageLoaded = true
              return
            }
            const fileURL = window.URL.createObjectURL(blobImage)
            const myImage = new Image()
            myImage.src = cachedImageBase64
            document.getElementById('img_' + uid).appendChild(myImage)
            document.getElementById('img_' + uid).setAttribute('href', fileURL)
            document.getElementById('img_' + uid).style.maxHeight = '100px'
            this.isImageLoaded = true
          })
        })
      } else {
        this.$store
          .dispatch(GET_FILE, uid)
          .then((resp) => {
            if (document.getElementById('img_' + uid)?.getElementsByTagName('img')?.length) {
              this.isImageLoaded = true
              return
            }
            writeCache(uid, new Blob([resp.data], { type: 'image/' + extension }))
            const fileURL = window.URL.createObjectURL(
              new Blob([resp.data], { type: 'image/' + extension })
            )
            const myImage = new Image()
            myImage.src = fileURL
            document.getElementById('img_' + uid).appendChild(myImage)
            document.getElementById('img_' + uid).setAttribute('href', fileURL)
            document.getElementById('img_' + uid).style.maxHeight = '100px'
            this.isImageLoaded = true
          })
          .catch((e) => {
            if (e?.message === 'Request failed with status code 404' && counter < 10) {
              setTimeout(() => {
                this.getImgUrl(uid, extension, filename, counter + 1)
              }, 500)
            }
          })
      }
    },
    getMovUrl (uid, extension, filename) {
      const fileURL = window.location.href + 'taskfile/' + uid + '?type=video&format=' + extension
      this.$nextTick(() => {
        document.getElementById('video_' + uid).setAttribute('href', fileURL)
      })
    },
    getAnyUrl (uid, extension, filename) {
      this.$store.dispatch(GET_FILE, uid).then((resp) => {
        const fileURL = window.URL.createObjectURL(new Blob([resp.data]))
        this.$emit('setLink', [fileURL, false])
        document.getElementById('any_' + uid).setAttribute('href', fileURL)
        document.getElementById('any_' + uid).setAttribute('download', filename)
        return fileURL
      })
    },
    getAudioUrl (uid, extension, filename) {
      this.$store.dispatch(GET_FILE, uid).then((resp) => {
        const fileURL = window.URL.createObjectURL(
          new Blob([resp.data], { type: 'audio/' + extension })
        )
        this.$emit('setLink', [fileURL, true])
        const myAudio = new Audio()
        myAudio.src = fileURL
        document.getElementById('audio_' + uid).appendChild(myAudio)
        document.getElementById('audio_' + uid).setAttribute('src', fileURL)
        document.getElementById('audio_' + uid).setAttribute('download', filename)
        return myAudio
      })
    },
    getDocUrl (uid, extension, filename) {
      this.$store.dispatch(GET_FILE, uid).then((resp) => {
        const fileURL = window.URL.createObjectURL(
          new Blob([resp.data], { type: 'text/plain' })
        )
        this.$emit('setLink', [fileURL, false])
        document.getElementById('doc_' + uid).setAttribute('href', fileURL)
        document.getElementById('doc_' + uid).setAttribute('download', filename)
        return fileURL
      })
    }
  }
}
</script>
