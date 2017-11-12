import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';
import SliderEntry from './SliderCard';
import Carousel from './Carousel';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

class LocationsMap extends Component {
  static propTypes = {
    markers: PropTypes.arrayOf(PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    })),
    initialRegion: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      latitudeDelta: PropTypes.number,
    }),
    markerColor: PropTypes.string,
    activeMarkerColor: PropTypes.string,
    isTriggerAreaChange: PropTypes.bool,
    regionChangeDelta: PropTypes.number,
    areaChangeMessage: PropTypes.string,
    renderCard: PropTypes.func,
    onAreaChange: PropTypes.func,
  };

  static defaultProps = {
    markers: [],
    initialRegion: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.002,
    },
    markerColor: '#900',
    activeMarkerColor: 'green',
    isTriggerAreaChange: false,
    regionChangeDelta: 0.002,
    areaChangeMessage: 'Search this area',
    renderCard() {},
    onAreaChange() {},
  };

  constructor(props) {
    super(props);

    this.state = {
      currentMarkerNumber: 0,
      isRegionChanged: false,
      currentRegion: null,
    };
  }

  /**
   * Update current marker and switch to linked card
   */
  handleOnMarkerPress = (currentMarkerNumber) => {
    this.setState({ currentMarkerNumber });
    this.сarousel._animateToPage(currentMarkerNumber, false, 'byMarker');
  }

  /**
   * Checks if visible region change more than delta
   */
  hanleRegionChange = (region) => {
    const { latitude, longitude } = this.props.initialRegion;
    const changedPosition = (Math.abs(region.latitude) + Math.abs(region.longitude)) - Math.abs(latitude) - Math.abs(longitude);

    this.setState({
      isRegionChanged: Math.abs(changedPosition) > this.props.regionChangeDelta,
      currentRegion: region,
    });
  }

  /**
   * Handle area changes press
   */
  handleAreaChangePress = () => {
    this.setState({
      isRegionChanged: false,
      currentMarkerNumber: 0,
     });
    this.сarousel._animateToPage(0, false, 'byMarker');
    this.props.onAreaChange(this.state.currentRegion);
  }

  /**
   * Handle swipe on carousel item
   */
  handleCardSwtich = currentMarkerNumber => this.setState({ currentMarkerNumber });

  render() {
    const {
      markers, initialRegion, markerColor, activeMarkerColor,
      isTriggerAreaChange, areaChangeMessage,
      renderCard,
     } = this.props;
    const { currentMarkerNumber } = this.state;

    return (
      <View style={styles.container}>
        {/* Map with markers */}
        <MapView
          style={styles.map}
          moveOnMarkerPress={false}
          onRegionChangeComplete={isTriggerAreaChange ? this.hanleRegionChange : null}
          initialRegion={{ ...initialRegion, ...{ longitudeDelta: initialRegion.latitudeDelta * ASPECT_RATIO }}}
        >
          {markers.map(({ latitude, longitude }, i) => (
            <MapView.Marker
              key={i}
              onPress={this.handleOnMarkerPress.bind(null, i)}
              coordinate={{ latitude, longitude }}
              identifier={`Marker${i}`}
            >
              <View>
                <Icon name="map-marker" size={35} color={currentMarkerNumber === i ? activeMarkerColor : markerColor} />
              </View>
            </MapView.Marker>
          ))}
        </MapView>

        {/* Area change */}
        {isTriggerAreaChange && this.state.isRegionChanged && this.state.currentRegion && this.state.currentRegion.latitude !== 0 && (
          <TouchableOpacity onPress={this.handleAreaChangePress} style={[styles.bubble, styles.button]}>
            <Text>{areaChangeMessage}</Text>
          </TouchableOpacity>
        )}

        {/* Cards */}
        <View style={styles.carousel_wrapper}>
          <Carousel
            ref={ref => (this.сarousel = ref)}
            style={[styles.carousel]}
            autoplay={false}
            onAnimateNextPage={this.handleCardSwtich}
          >
            {markers.map((renderCard))}
          </Carousel>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 2,
  },
  carousel: {
    width,
    height: 90,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    position: 'absolute',
    bottom: 105,
    left: 0,
    right: 0,
  },
  button: {
    marginTop: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  carousel_wrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'flex-end',
  },
});

export default LocationsMap;
