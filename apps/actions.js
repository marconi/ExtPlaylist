'use strict'

const youtubeApiKey = ''
const youtubeApiBaseUrl = 'https://www.googleapis.com/youtube/v3'

export const SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD'
export const SEARCH_STARTED = 'SEARCH_STARTED'
export const SEARCH_RESULT = 'SEARCH_RESULT'
export const SEARCH_FAILED = 'SEARCH_FAILED'
export const MORE_SEARCH_RESULT = 'MORE_SEARCH_RESULT'
export const NEW_SEARCH = 'NEW_SEARCH'
export const VIEW_VIDEO_STARTED = 'VIEW_VIDEO_STARTED'
export const VIEW_VIDEO_RESULT = 'VIEW_VIDEO_RESULT'
export const VIEW_VIDEO_FAILED = 'VIEW_VIDEO_FAILED'
export const VIEW_VIDEO_UNLOAD = 'VIEW_VIDEO_UNLOAD'
export const LIST_PLAYLIST_UNLOAD = 'LIST_PLAYLIST_UNLOAD'
export const LIST_PLAYLIST_STARTED = 'LIST_PLAYLIST_STARTED'
export const LIST_PLAYLIST_ITEMS = 'LIST_PLAYLIST_ITEMS'
export const LIST_PLAYLIST_FAILED = 'LIST_PLAYLIST_FAILED'
export const PLAYLIST_ADD_STARTED = 'PLAYLIST_ADD_STARTED'
export const PLAYLIST_ADD_SUCCESSFUL = 'PLAYLIST_ADD_SUCCESSFUL'
export const PLAYLIST_ADD_FAILED = 'PLAYLIST_ADD_FAILED'

export const newSearch = () => ({type: NEW_SEARCH})
export const setSearchKeyword = (keyword) => ({type: SET_SEARCH_KEYWORD, keyword})
export const runSearch = (keyword) => (dispatch) => _searchVideos(dispatch, keyword)
export const moreVideos = (keyword, nextPageToken) => (dispatch) => _searchVideos(dispatch, keyword, nextPageToken)

const _searchVideos = (dispatch, keyword, nextPageToken = null) => {
	dispatch(_searchStarted(keyword))

	const encodedKeyword = keyword.replace(' ', '+')
	let url = `${youtubeApiBaseUrl}/search?part=snippet&q=${encodedKeyword}&type=video&maxResults=10&key=${youtubeApiKey}`
	if (nextPageToken) {
		url += `&pageToken=${nextPageToken}`
	}

	return fetch(url)
		.then((resp) => resp.json())
		.then((data) => {
			if (data.error) throw data.error.message || 'Unable to search'
			return data
		})
		.then((data) => {
			if (nextPageToken) {
				dispatch(_moreSearchResultReceived(data))
			} else {
				dispatch(_searchResultReceived(data))
			}
		})
		.catch((err) => {
			dispatch(_searchFailed(err))
		})
}
const _searchStarted = (keyword) => ({type: SEARCH_STARTED, keyword})
const _searchResultReceived = (data) => ({type: SEARCH_RESULT, data})
const _moreSearchResultReceived = (data) => ({type: MORE_SEARCH_RESULT, data})
const _searchFailed = (message) => ({type: SEARCH_FAILED, message})

export const viewVideoUnload = () => ({type: VIEW_VIDEO_UNLOAD})
export const viewVideo = (videoId) => {
	return (dispatch) => {
		dispatch(_viewVideoStarted())

		const url = `${youtubeApiBaseUrl}/videos?part=snippet%2Cstatistics%2Cplayer&id=${videoId}&maxResults=1&key=${youtubeApiKey}`
		return fetch(url)
			.then((resp) => resp.json())
			.then((data) => {
				if (data.error) throw data.error.message || 'Unable to view video'
				return data
			})
			.then((data) => {
				const video = (data.pageInfo.totalResults > 0) ? data.items[0] : null
				dispatch(_viewVideoResult(video))
			})
			.catch((err) => {
				dispatch(_viewVideoFailed(err))
			})
	}
}
const _viewVideoStarted = () => ({type: VIEW_VIDEO_STARTED})
const _viewVideoResult = (data) => ({type: VIEW_VIDEO_RESULT, data})
const _viewVideoFailed = (message) => ({type: VIEW_VIDEO_FAILED, message})

export const addToPlaylist = (playlistName, videoId) => {
	return (dispatch) => {
		dispatch(_addToPlaylistStarted(playlistName))

		const url = `http://localhost:8080/api/v1/buckets/${playlistName}`
		return fetch(url, {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					key: videoId,
					value: videoId
				})
			})
			.then((resp) => {
				if (resp.status >= 200 && resp.status < 300) return resp
				throw resp
			})
			.then((resp) => resp.json())
			.then((videoId) => {
				dispatch(_addToPlaylistSuccessful(playlistName, videoId))
			})
			.catch((resp) => resp.json())
			.then((err) => {
				dispatch(_addToPlaylistFailed(err.Error || null))
			})
	}
}
const _addToPlaylistStarted = (playlistName) => ({type: PLAYLIST_ADD_STARTED, playlistName})
const _addToPlaylistSuccessful= (playlistName, videoId) => ({type: PLAYLIST_ADD_SUCCESSFUL, playlistName, videoId})
const _addToPlaylistFailed = (message) => ({type: PLAYLIST_ADD_FAILED, message})

export const listPlaylistUnload = () => ({type: LIST_PLAYLIST_UNLOAD})
export const listPlaylist = (videoId = null) => {
	return (dispatch) => {
		dispatch(_listPlaylistStarted(videoId))

		const url = 'http://localhost:8080/api/v1/buckets?full=1'
		return fetch(url)
			.then((resp) => {
				if (resp.status >= 200 && resp.status < 300) return resp
				throw resp
			})
			.then((resp) => resp.json())
			.then((data) => {
				dispatch(_listPlaylistItems(data))
			})
			.catch((resp) => resp.json())
			.then((err) => {
				dispatch(_listPlaylistFailed(err.Error || null))
			})
	}
}
const _listPlaylistStarted = (videoId) => ({type: LIST_PLAYLIST_STARTED, videoId})
const _listPlaylistItems = (data) => ({type: LIST_PLAYLIST_ITEMS, data})
const _listPlaylistFailed = (message) => ({type: LIST_PLAYLIST_FAILED, message})
