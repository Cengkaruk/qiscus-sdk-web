<template>
  <div>
    <div class="image-container" v-if="isLoading">Loading image ...</div>
    <div class="qcw-image-container" v-if="isImage && !isLoading && error==''" @click="onClickImage(uri)">
      <img :src="imageSrc" :alt="imageSrc" />
    </div>
    <div v-if="error">
      <p><i class="fa fa-times fa-fw fa-2x"></i> {{ error }}</p>
      <button @click="loadImage" class="reload-image-btn">Reload Image</button>
    </div>
    <div class="qcw-file-container" v-if="!isImage && !isLoading">
      <a :href="uri" target="_blank">
        <i class="fa" aria-hidden="true" :class="fileClassName"></i>
        <div class="file-name">{{ filename }}</div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ImageLoader',
    props: ['comment', 'callback', 'onClickImage'],
    data() {
      return {
        isLoading: true,
        isImage: false,
        imageSrc: '',
        uri: this.comment.getAttachmentURI(),
        filename: '',
        ext: '',
        error: ''
      }
    },
    computed: {
      fileClassName() {
        const ext = this.ext.toLowerCase()
        const videos = ['mov','mp4','avi','mkv']
        const images = ['jpg','jpeg','gif','webp','png']
        const archives = ['tar', 'zip', 'rar', 'iso']
        if ( videos.indexOf(ext) > -1 ) return 'fa-file-video-o';
        if ( images.indexOf(ext) > -1 ) return 'fa-file-image-o';
        if ( archives.indexOf(ext) > -1 ) return 'fa-file-archive-o';
        return 'fa-file-text'
      }
    },
    created() {
      this.loadImage();
    },
    methods: {
      loadImage() {
        const self    = this;
        const comment = this.comment;
        self.isImage  = (comment.isImageAttachment()) ? true: false;
        self.uri      = comment.getAttachmentURI();
        self.filename = self.uri.split('/').pop().split('#')[0].split('?')[0];
        self.ext      = self.filename.split('.').pop();
        self.isLoading = true;
        self.error   = '';

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200){
            self.imageSrc  = URL.createObjectURL(this.response);
            self.isLoading = false;
            // setTimeout( () => self.callback(), 0 );
          } 
        }
        xhr.open('GET', self.uri, true);
        xhr.onerror = function() {
          self.isLoading = false;
          self.error = `Url ${self.uri} loading failed, please try again`
          self.callback();
        }
        // xhr.setRequestHeader('Authorization', 'Token token='+window.doctortoken);
        xhr.responseType = 'blob';
        xhr.send();
      }
    }
  }
</script>

<style lang="scss">
  .image-container { height: 100px; }
  .reload-image-btn {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 7px 15px;
    text-align: center;
    cursor: pointer;
    background: #eee;
    color: #FFF;
    border: 2px solid #FFF;
    font-weight: bold;
    border-radius: 5px;
    color: #444;
  }
</style>