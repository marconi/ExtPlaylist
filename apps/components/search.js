'use strict'

import React, {
	View,
	Text,
	TextInput,
	Image,
	StyleSheet,
	ActivityIndicatorIOS,
	TouchableOpacity
} from 'react-native'
import { runSearch } from '../actions'

class Search extends React.Component {
	handleKeywordChange(event) {
		this.props.setSearchKeyword(event.nativeEvent.text.trim())
	}

	handleSubmit(event) {
		this.props.runSearch(this.props.keyword)
	}

	handleEnjoy() {
		this.props.listPlaylist(null, true)
	}

	render() {
		return (
			<View style={styles.container}>
				<Image
					style={styles.logo}
					source={require('../images/youtube-logo.png')} />
				{this.props.isSearching ? 
					<ActivityIndicatorIOS
						style={styles.preloader}
						animating={this.props.isSearching}
						color="#111"
						size="large"/> : 
					<TextInput
						style={styles.searchInput}
						value={this.props.keyword}
						onChange={this.handleKeywordChange.bind(this)}
						onSubmitEditing={this.handleSubmit.bind(this)}
						placeholder="Search for videos" />
				}
				{this.props.error ? <Text style={styles.error}>{this.props.error}</Text> : null}
				<Text style={styles.info}><Text style={{fontWeight: 'bold'}}>extPlaylist</Text> lets you search for youtube videos and create playlist outside of youtube in 3 easy steps:</Text>
				<Text style={styles.step}>1. Search for videos</Text>
				<Text style={styles.step}>2. Add to existing or new playlist</Text>
				<Text style={styles.step}>3. Enjoy your playlist!</Text>
			</View>
		)
	}
}

Search.propTypes = {
	error: React.PropTypes.string.isRequired,
	keyword: React.PropTypes.string.isRequired,
	isSearching: React.PropTypes.bool.isRequired,
	setSearchKeyword: React.PropTypes.func.isRequired,
	runSearch: React.PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#F1F1F1',
		paddingTop: 100,
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 20
	},
	logo: {
		width: 250,
		height: 150,
		alignSelf: 'center'
	},
	searchInput: {
		height: 60,
		padding: 10,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#cccccc',
		borderRadius: 8,
		marginBottom: 20
	},
	info: {
		marginBottom: 10
	},
	step: {
		marginBottom: 5
	},
	preloader: {
		marginBottom: 20
	},
	error: {
		fontSize: 15,
		color: 'red',
		marginBottom: 20,
		alignSelf: 'center'
	}
})

module.exports = Search
