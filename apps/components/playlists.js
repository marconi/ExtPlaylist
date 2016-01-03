'use strict'

import React, {
	View,
	Text,
	StyleSheet,
	ListView,
	TouchableOpacity,
	ActivityIndicatorIOS,
} from 'react-native';

class Playlists extends React.Component {
	constructor(props) {
		super(props)
		this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
		this.state = {
			dataSource: this.ds.cloneWithRows(this.props.playlist.items),
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: this.ds.cloneWithRows(nextProps.playlist.items)
		})
	}

	componentWillUnmount() {
		this.props.listPlaylistUnload()   
	}

	handlePlaylistSelect(playlistName) {
		if (this.props.playlist.isViewingListPlaylistWithoutNavigator) {
			console.log('clicked...')
		} else {
			if (this.props.playlist.isAddingToPlaylist) return
			if (!this.props.playlist.videoIdForPlaylist) return
			this.props.addToPlaylist(playlistName, this.props.playlist.videoIdForPlaylist)
		}
	}

	renderRow(rowData) {
		const isTargetPlaylist = this.props.playlist.isAddingToPlaylist && this.props.playlist.playlistForVideoId === rowData
		return (
			<View style={styles.row}>
				{isTargetPlaylist ?
					<ActivityIndicatorIOS
						style={styles.playlistPreloader}
						animating={this.props.playlist.isAddingToPlaylist}
						color="#111111"
						size="small"/> :
					<TouchableOpacity
						style={styles.rowButton}
						onPress={() => this.handlePlaylistSelect(rowData.name)}
						activeOpacity={(this.props.playlist.isAddingToPlaylist) ? 1 : 0.2}>
						<Text style={styles.playlistName}>
							<Text style={{fontWeight: 'bold'}}>{rowData.items.length}</Text> {rowData.name}
						</Text>
					</TouchableOpacity>
				}
			</View>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<ListView
					style={styles.items}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	items: {
		flex: 1,
		backgroundColor: '#F1F1F1',
		padding: 10
	},
	row: {
		backgroundColor: '#ffffff',
		borderBottomWidth: 1,
		borderBottomColor: '#cccccc',
		marginBottom: 10
	},
	rowButton: {
		padding: 10,
	},
	playlistName: {
		flex: 1,
		marginLeft: 10,
		fontSize: 16
	},
	playlistPreloader: {
		marginTop: 10,
		marginBottom: 10
	}
})

module.exports = Playlists
