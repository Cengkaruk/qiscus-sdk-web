import find from 'lodash/fp/find'
import {scrollToBottom} from '../../sdk/utils';

export default {
  toggleDevMode: ({commit, state}) => commit('TOGGLE_DEV_MODE'),
  changeRoom: ({commit, state}, room) => commit('CHANGE_ROOM', room),
  toggleChatWindow: ({commit, state}) => commit('TOGGLE_CHAT_WINDOW'),
  chatTarget: ({commit, state}, {email, options = {}}) => {
    return state.qiscus.chatTarget(email, options)
    .then((response) => {
      commit('CHAT_TARGET', {email, options})
      const selected = state.qiscus.selected.comments
      const latestCommentId = (selected.length > 0) ? selected[selected.length-1].id : 0
      scrollToBottom(latestCommentId);
      return Promise.resolve(state.qiscus.selected)
    }, (error) => {
      // vm.$toasted.error('Error getting chat room. Please make sure the target is valid')
      return Promise.reject(error)
    })
  },
  chatGroup: ({commit, state}, {id, oldSelected, commentId}) => {
    commit('CHAT_GROUP', {id, oldSelected});
    const selected = state.qiscus.selected.comments;
    const latestCommentId = (selected.length > 0) ? selected[selected.length-1].id : 0;
    const commentForm = document.getElementsByClassName('qcw-comment-form');
    scrollToBottom(latestCommentId);
  },
  backToHome: ({commit, state}) => commit('BACK_TO_HOME'),
  submitComment: ({commit, state, dispatch}, {topic_id, comment}) => {
    return state.qiscus.submitComment(topic_id, comment)
    .then((response) => {
      commit('SUBMIT_COMMENT', state.qiscus.selected)
      const selected = state.qiscus.selected.comments
      const latestCommentId = (selected.length > 0) ? selected[selected.length-1].id : 0
      setTimeout(function(){
        if(latestCommentId > 0){
          const elementToScroll = document.getElementById(latestCommentId)
          elementToScroll.scrollIntoView({block: 'end', behavior: 'smooth'})
        }
        //on entering the room, wait for data processed then focus on comment form
        document.getElementsByClassName('qcw-comment-form').item(0).getElementsByTagName('textarea').item(0).focus();
      }, 0)
      return Promise.resolve(state.qiscus.selected);
    }, (error) => {
      return Promise.reject(error)
    })
  },
  submitCommentWithPayload: ({commit, state, dispatch}, {topic_id, comment, payload_type, payload}) => {
    return state.qiscus.submitComment(topic_id, comment, null, 'reply', JSON.stringify(payload))
    .then( response => {
      commit('SUBMIT_COMMENT', state.qiscus.selected)
      const selected = state.qiscus.selected.comments
      const latestCommentId = (selected.length > 0) ? selected[selected.length-1].id : 0
      setTimeout(function(){
        if(latestCommentId > 0){
          const elementToScroll = document.getElementById(latestCommentId)
          elementToScroll.scrollIntoView({block: 'end', behavior: 'smooth'})
        }
        //on entering the room, wait for data processed then focus on comment form
        document.getElementsByClassName('qcw-comment-form').item(0).getElementsByTagName('textarea').item(0).focus();
      }, 0)
      return Promise.resolve(state.qiscus.selected);
    }, (error) => {
      return Promise.reject(error)
    })
  },
  resendComment: ({commit, state}, comment) => {
    return state.qiscus.resendComment(comment)
    .then((response) => {
      commit('SUBMIT_COMMENT', state.qiscus.selected)
      const selected = state.qiscus.selected.comments
      const latestCommentId = (selected.length > 0) ? selected[selected.length-1].id : 0
      setTimeout(function(){
        if(latestCommentId > 0){
          const elementToScroll = document.getElementById(latestCommentId)
          elementToScroll.scrollIntoView({block: 'end', behavior: 'smooth'})
        }
        //on entering the room, wait for data processed then focus on comment form
        document.getElementsByClassName('qcw-comment-form').item(0).getElementsByTagName('textarea').item(0).focus();
      }, 0)
      console.info('resend comment successful')
      return Promise.resolve(state.qiscus.selected);
    }, error => {
      console.error('resend comment error', error)
      return Promise.reject(error)
    })
  },
  loadComments: ({commit, state}, payload) => commit('LOAD_COMMENTS', payload),
  sync: ({commit}) => commit('SYNC'),
  setTyping: ({commit}, payload) => commit('SET_TYPING', payload),
  setDelivered: ({commit, state}, payload) => {
    // find the comment that need to be altered
    const commentToFind = find(selectedComment => {
      return (
        payload.unique_temp_id
          ? selectedComment.unique_id === payload.unique_temp_id
          : selectedComment.id === payload.id
      )
    })(state.qiscus.selected.comments)
    if (commentToFind){
      commentToFind.markAsRead()
      commit('SET_DELIVERED', commentToFind)
    }
  },
  setRead: ({commit, state}, payload) => {
    // find the comment that need to be altered
    const commentToFind = find(selectedComment => {
      return (
        payload.unique_temp_id
          ? selectedComment.unique_id === payload.unique_temp_id
          : selectedComment.id === payload.id
      )
    })(state.qiscus.selected.comments)
    if (commentToFind){
      commentToFind.markAsRead()
      commit('SET_READ', commentToFind)
    }
  },
  toggleInit: ({commit}) => commit('TOGGLE_INIT'),
  updateSelected: ({commit}) => commit('UPDATE_SELECTED'),
  openImageModal: ({commit}, payload) => commit('OPEN_IMAGE_MODAL', payload),
  closeImageModal: ({commit}) => commit('CLOSE_IMAGE_MODAL'),
  subscribeUserChannel: ({commit}) => commit('SUBSCRIBE_USER_CHANNEL'),
  setNewCommentText: ({commit}, payload) => commit('SET_NEW_COMMENT_TEXT', payload),
  activateMqtt: ({commit}) => commit('ACTIVATE_MQTT'),
}
// topic_id, last_comment_id, timestamp, after