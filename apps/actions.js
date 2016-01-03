'use strict'

const youtubeApiKey = ''
const youtubeApiBaseUrl = 'https://www.googleapis.com/youtube/v3'

export const SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD'
export const SEARCH_STARTED = 'SEARCH_STARTED'
export const SEARCH_RESULT = 'SEARCH_RESULT'
export const SEARCH_FAILED = 'SEARCH_FAILED'
export const MORE_SEARCH_RESULT = 'MORE_SEARCH_RESULT'
export const NEW_SEARCH = 'NEW_SEARCH'

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
