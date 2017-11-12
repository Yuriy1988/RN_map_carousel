import React, { Component } from 'react';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';
import { withKnobs, object, color, boolean, number, text } from '@kadira/storybook-addon-knobs';
import { WithNotes } from '@kadira/storybook-addon-notes';

import LocationsMap from '../../components/LocationsMap';
import SliderCard from '../../components/SliderCard';

storiesOf('Maps', module)
  .addDecorator(withKnobs)
  .add('Locations Map', () => {
    const markers = object('Markers', {
      data: [{
        id: '1',
        title: 'First Marker',
        latitude: 37.77825,
        longitude: -122.4424,
      }, {
        id: '2',
        title: 'Second Marker',
        latitude: 37.768249999999995,
        longitude: -122.4524,
      }, {
        id: '3',
        title: 'Third Marker',
        latitude: 37.75825,
        longitude: -122.4624,
      }]
    });

    const initialRegion = object('Initial Position', {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
    });

    const markerColor = color('Marker Color', '#900');
    const activeMarkerColor = color('Active Marker Color', 'green');
    const isTriggerAreaChange = boolean('Can Search in new Area?', true);
    const regionChangeDelta = number('Delta of new Area', 0.05);
    const areaChangeMessage = text('Search this area');


    onAreaChangedMarkers = [];
    const genereteMarkers = ({latitude, longitude}) => {
      onAreaChangedMarkers.length = 0;
      for (let i = 0; i < 10; i++) {
        const random = Math.random()/40;
        onAreaChangedMarkers.push({
          id: i,
          title: `${i} Marker`,
          latitude: latitude + random,
          longitude: longitude + random,
        })
      }
    }

    const renderCard = (card) => {
      return (
        <SliderCard
          title={card.title}
          key={card.id}
          {...card}
        />
      )
    }

    class LocationsMapWrapper extends Component {
      constructor(props) {
        super(props);

        this.state = {
          markers: markers.data,
        };
      }

      handleAreaChange = ({ latitude, longitude }) => {
        genereteMarkers({ latitude, longitude });
        this.setState({
          markers: onAreaChangedMarkers,
        })
      };

      render() {
        return (
          <WithNotes notes="Map">
            <LocationsMap
              markers={this.state.markers}
              initialRegion={initialRegion}
              isTriggerAreaChange={isTriggerAreaChange}
              renderCard={renderCard}
              onAreaChange={this.handleAreaChange}
              activeMarkerColor={activeMarkerColor}
              markerColor={markerColor}
              regionChangeDelta={regionChangeDelta}
              areaChangeMessage={areaChangeMessage}
            />
          </WithNotes>
        );
      }
    }

    return (
      <LocationsMapWrapper />
    );
  });
