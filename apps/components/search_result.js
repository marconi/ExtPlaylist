'use strict'

import React, {
	Text,
	View,
	TouchableHighlight,
	TouchableOpacity,
	ListView,
	Image,
	StyleSheet,
	ActivityIndicatorIOS
} from 'react-native'

class SearchResult extends React.Component {
	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
		this.state = {
			dataSource: this.ds.cloneWithRows(this.props.result.items),
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: this.ds.cloneWithRows(nextProps.result.items)
		})
	}

	handleRowPress(rowData) {
		if (this.props.isViewingVideo) return
		this.props.viewVideo(rowData.id.videoId)
	}

	renderRow(rowData) {
		return (
			<View style={styles.row}>
				<TouchableOpacity
					style={styles.rowButton}
					onPress={() => this.handleRowPress(rowData)}
					activeOpacity={(this.props.isViewingVideo) ? 1 : 0.2}>
					<View style={styles.rowWrapper}>
						<Image
							style={styles.thumbnail}
							source={{uri: rowData.snippet.thumbnails.default.url}} />
						<Text style={styles.title}>{rowData.snippet.title}</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}

	handleMore() {
		this.props.moreVideos(this.props.keyword, this.props.result.nextPageToken)
	}

	render() {
		let footer = null
		const isLoading = this.props.isSearching || this.props.isViewingVideo
		if (isLoading) {
			footer = (
				<View style={styles.footer}>
					<ActivityIndicatorIOS
						animating={isLoading}
						color="#ffffff"
						size="small"/>
				</View>
			)
		} else {
			footer = (
				<TouchableHighlight
					style={styles.footer}
					underlayColor="#991111"
					onPress={this.handleMore.bind(this)}>
					<Text style={styles.moreButtonText}>Show more</Text>
				</TouchableHighlight>
			)
		}

		return (
			<View style={styles.container}>
				<ListView
					style={styles.items}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)} />
				{this.props.result.nextPageToken ? footer : null}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	items: {
		flex: 1,
		backgroundColor: '#F1F1F1',
		padding: 10,
	},
	footer: {
		padding: 15,
		flexDirection: 'row',
		backgroundColor: '#E62117',
		alignSelf: 'stretch',
		justifyContent: 'center',
	},
	moreButtonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	row: {
		backgroundColor: '#ffffff',
		borderBottomWidth: 1,
		borderBottomColor: '#cccccc',
		marginBottom: 10
	},
	rowWrapper: {
		flex: 1,
		flexDirection: 'row',
    justifyContent: 'center',
	},
	rowButton: {
		padding: 10,
	},
	title: {
		flex: 1,
		marginLeft: 10,
		color: '#4078C0',
		fontWeight: 'bold'
	},
	thumbnail: {
		width: 120,
		height: 90
	}
})

module.exports = SearchResult
