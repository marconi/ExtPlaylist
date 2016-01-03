'use strict'

import { combineReducers } from 'redux'
import {
	SET_SEARCH_KEYWORD,
	SEARCH_STARTED,
	SEARCH_RESULT,
	SEARCH_FAILED,
	MORE_SEARCH_RESULT,
	NEW_SEARCH,
	VIEW_VIDEO_STARTED,
	VIEW_VIDEO_RESULT,
	VIEW_VIDEO_FAILED,
	VIEW_VIDEO_UNLOAD,
	LIST_PLAYLIST_UNLOAD,
	LIST_PLAYLIST_STARTED,
	LIST_PLAYLIST_ITEMS,
	LIST_PLAYLIST_FAILED,
	PLAYLIST_ADD_STARTED,
	PLAYLIST_ADD_FAILED,
	PLAYLIST_ADD_SUCCESSFUL,
} from './actions'

const initialSearchState = {
	// searching
	error: '',
	keyword: '',
	isViewingResult: false,
	isSearching: false,

	// viewing video details
	isViewingVideo: false,
	viewedVideo: null,

	// search result
	result: {
		items: [],
		prevPageToken: null,
		nextPageToken: null,
		pageInfo: {
			resultsPerPage: 0,
			totalResults: 0
		}
	}
}

const search = (state = initialSearchState, action) => {
	switch (action.type) {
		case SET_SEARCH_KEYWORD:
			return Object.assign({}, state, {keyword: action.keyword})
		case SEARCH_STARTED:
			return Object.assign({}, state, {isSearching: true})
		case SEARCH_FAILED:
			return Object.assign({}, state, {
				error: action.message,
				isViewingResult: false,
				isSearching: false,
				result: {
					items: [],
					prevPageToken: null,
					nextPageToken: null,
					pageInfo: {
						resultsPerPage: 0,
						totalResults: 0
					}
				}
			})
		case SEARCH_RESULT:
			return Object.assign({}, state, {
				isViewingResult: true,
				isSearching: false,
				result: Object.assign({}, state.result, {
					items: action.data.items,
					prevPageToken: action.data.prevPageToken || null,
					nextPageToken: action.data.nextPageToken || null,
					pageInfo: action.data.pageInfo
				})
			})
		case MORE_SEARCH_RESULT:
			return Object.assign({}, state, {
				isViewingResult: true,
				isSearching: false,
				isViewingVideo: false,
				viewedVideo: null,
				result: Object.assign({}, state.result, {
					items: [
						...state.result.items,
						...action.data.items
					],
					prevPageToken: action.data.prevPageToken || null,
					nextPageToken: action.data.nextPageToken || null,
					pageInfo: action.data.pageInfo
				})
			})
		case NEW_SEARCH:
			return initialSearchState
		case VIEW_VIDEO_STARTED:
			return Object.assign({}, state, {
				isViewingVideo: true,
				viewedVideo: null
			})
		case VIEW_VIDEO_RESULT:
			return Object.assign({}, state, {
				isViewingVideo: false,
				viewedVideo: action.data
			})
		case VIEW_VIDEO_FAILED:
			return Object.assign({}, state, {
				isViewingVideo: false,
				viewedVideo: null
			})
		case VIEW_VIDEO_UNLOAD:
			return Object.assign({}, state, {
				isViewingVideo: false,
				viewedVideo: null
			})
		default:
			return state
	}
}

const initialPlaylistState = {
	isViewingListPlaylist: false,
	isViewingListPlaylistWithoutNavigator: false,
	isViewingListPlaylistStarted: false,
	videoIdForPlaylist: null,  // video to be added
	playlistForVideoId: null,  // destination playlist
	items: [],
	isAddingToPlaylist: false
}

const playlist = (state = initialPlaylistState, action) => {
	switch (action.type) {
		case LIST_PLAYLIST_UNLOAD:
			return Object.assign({}, state, {
				isViewingListPlaylist: false,
				isAddingToPlaylist: false,
				playlistForVideoId: null,
				videoIdForPlaylist: null
			})
		case LIST_PLAYLIST_STARTED:
			return Object.assign({}, state, {
				isViewingListPlaylist: true,
				isViewingListPlaylistWithoutNavigator: action.withoutNavigator,
				isViewingListPlaylistStarted: true,
				videoIdForPlaylist: action.videoId
			})
		case LIST_PLAYLIST_ITEMS:
			return Object.assign({}, state, {
				isViewingListPlaylistStarted: false,
				items: action.data
			})
		case LIST_PLAYLIST_FAILED:
			return Object.assign({}, state, {
				isViewingListPlaylistStarted: false,
				items: []
			})
		case PLAYLIST_ADD_STARTED:
			return Object.assign({}, state, {
				isAddingToPlaylist: true,
				playlistForVideoId: action.playlistName
			})
		case PLAYLIST_ADD_SUCCESSFUL:
			const playlistNames = state.items.map((playlist) => playlist.name)
			const index = playlistNames.indexOf(action.playlistName)
			if (index === -1) {
				console.log('invalid playlist name, skipping...')

				return Object.assign({}, state, {
					isAddingToPlaylist: false,
					playlistForVideoId: null,
				})
			}

			const playlist = state.items[index]
			const playlistKeys = playlist.items.map((item) => item.Key)
			const videoIndex = playlistKeys.indexOf(action.videoId)

			if (videoIndex !== -1) {
				console.log('already exists, skipping...')

				return Object.assign({}, state, {
					isAddingToPlaylist: false,
					playlistForVideoId: null,
				})
			}

			const newPlaylist = Object.assign({}, playlist, {
				items: [
					...playlist.items,
					{Key: action.videoId, Value: action.videoId}
				]
			})

			return Object.assign({}, state, {
				isAddingToPlaylist: false,
				playlistForVideoId: null,
				items: [
					...state.items.slice(0, index),
					newPlaylist,
					...state.items.slice(index+1, state.items.length),
				]
			})
		case PLAYLIST_ADD_FAILED:
			return Object.assign({}, state, {
				isAddingToPlaylist: false,
				playlistForVideoId: null
			})
		default:
			return state
	}
}

const rootReducer = combineReducers({
	search,
	playlist
})

export default rootReducer
