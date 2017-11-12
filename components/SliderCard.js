import { StyleSheet, Dimensions, Platform, View, Text, TouchableOpacity } from 'react-native';
import React, { Component, PropTypes } from 'react';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class SliderCard extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    illustration: PropTypes.string,
  };

  render() {
    const { title, subtitle } = this.props;
    return (
      <View
        activeOpacity={0.9}
        style={styles.slideInnerContainer}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>{ title.toUpperCase() }</Text>
          <Text style={styles.subtitle} numberOfLines={2}>{ subtitle }</Text>
        </View>
      </View>
    );
  }
}


function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.4;
const slideWidth = wp(75);

export const sliderWidth = viewportWidth;
export const itemHorizontalMargin = wp(2);
export const itemWidth = slideWidth + (itemHorizontalMargin * 2);

const entryBorderRadius = 6;

const styles = StyleSheet.create({
  slideInnerContainer: {
    height: slideHeight,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#888888',
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  textContainer: {
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
  },
  title: {
    color: '#1a1917',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 6,
    color: '#888888',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
