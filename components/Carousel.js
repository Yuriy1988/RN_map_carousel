import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

const PAGE_CHANGE_DELAY = 4000;

export default class Carousel extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    autoplay: PropTypes.bool,
    delay: PropTypes.number,
    currentPage: PropTypes.number,
    style: View.propTypes.style,
    pageStyle: View.propTypes.style,
    contentContainerStyle: View.propTypes.style,
    pageInfo: PropTypes.bool,
    pageInfoBackgroundColor: PropTypes.string,
    pageInfoTextStyle: Text.propTypes.style,
    pageInfoTextSeparator: PropTypes.string,
    bullets: PropTypes.bool,
    bulletsContainerStyle: Text.propTypes.style,
    bulletStyle: Text.propTypes.style,
    chosenBulletStyle: Text.propTypes.style,
    onAnimateNextPage: PropTypes.func,
  };

  static defaultProps = {
    delay: PAGE_CHANGE_DELAY,
    autoplay: false,
    pageInfo: false,
    bullets: false,
    pageInfoBackgroundColor: 'rgba(0, 0, 0, 0.25)',
    pageInfoTextSeparator: ' / ',
    currentPage: 0,
  };

  constructor(props) {
    super(props);
    const size = { width: 0, height: 0 };
    if (props.children) {
      const childrenLength = props.children.length ? props.children.length : 1;
      this.state = {
        currentPage: props.currentPage,
        size,
        childrenLength,
      };
    } else {
      this.state = { size };
    }
  }

  componentDidMount() {
    if (this.state.childrenLength) {
      this._setUpTimer();
    }
  }

  componentWillUnmount() {
    this._clearTimer();
  }

  componentWillReceiveProps(nextProps) {
    let childrenLength = 0;
      if (nextProps.children) {
        childrenLength = nextProps.children.length ? nextProps.children.length : 1;
      }
    this.setState({ childrenLength });
  }

  _onScrollBegin = () => {
    this._clearTimer();
  }

  _setCurrentPage = (currentPage, called) => {
    this.setState({ currentPage }, () => {
      if (this.props.onAnimateNextPage) {
        this.props.onAnimateNextPage.call(this, currentPage, called);
      }
    });
  }

  _onScrollEnd = (event) => {
    const offset = { ...event.nativeEvent.contentOffset };
    const page = this._calculateCurrentPage(offset.x);
    this._placeCritical(page);
    this._setCurrentPage(page);
    this._setUpTimer();
  }

  _onLayout = () => {
    this.container.measure((x, y, w, h) => {
    this.setState({
        size: { width: w, height: h },
      });
      this._placeCritical(this.state.currentPage);
    });
  }

  _clearTimer = () => {
    clearTimeout(this.timer);
  }

  _setUpTimer = () => {
    if (this.props.autoplay && this.props.children.length > 1) {
    this._clearTimer();
    this.timer = setTimeout(this._animateNextPage, this.props.delay);
    }
  }

  _scrollTo = (offset, animated) => {
    this.scrollView.scrollTo({ y: 0, x: offset, animated });
  }

  _animateNextPage = () => {
    const { currentPage } = this.state;
    this._animateToPage(this._normalizePageNumber(currentPage + 1));
  }

  _animateToPage = (page, animated, called) => {
    let currentPage = page;
    this._clearTimer();
    const { width } = this.state.size;
    const { childrenLength } = this.state;
    if (currentPage >= childrenLength) {
    currentPage = 0;
    }
    this._scrollTo(currentPage * width, animated);
    this._setCurrentPage(currentPage, called);
    this._setUpTimer();
  }

  _placeCritical = (page) => {
    const { childrenLength } = this.state;
    const { width } = this.state.size;
    if (childrenLength === 1) {
      this._scrollTo(0, false);
    }
    else if (page === 1) {
      this._scrollTo(width, false);
    } else {
      this._scrollTo(page * width, false);
    }
  }

  _normalizePageNumber = (page) => {
    const { childrenLength } = this.state;
    if (page === childrenLength) {
    return 0;
    } else if (page >= childrenLength) {
    return 1;
    }
    return page;
  }

  _calculateCurrentPage = (offset) => {
    const { width } = this.state.size;
    const page = Math.floor(offset / width);
    return this._normalizePageNumber(page);
  }

  _renderPageInfo = (pageLength) =>
  <View style={styles.pageInfoBottomContainer} pointerEvents="none">
    <View style={styles.pageInfoContainer}>
      <View
        style={[styles.pageInfoPill, { backgroundColor: this.props.pageInfoBackgroundColor }]}
      >
        <Text
          style={[styles.pageInfoText, this.props.pageInfoTextStyle]}
        >
          {`${this.state.currentPage + 1}${this.props.pageInfoTextSeparator}${pageLength}`}
        </Text>
      </View>
    </View>
  </View>

  _renderBullets = (pageLength) => {
    const bullets = [];
    for (let i = 0; i < pageLength; i += 1) {
      bullets.push(
        <TouchableWithoutFeedback onPress={() => this._animateToPage(i)} key={`bullet${i}`}>
          <View
            style={i === this.state.currentPage ?
              [styles.chosenBullet, this.props.chosenBulletStyle] :
              [styles.bullet, this.props.bulletStyle]}
          />
      </TouchableWithoutFeedback>);
    }
    return (
      <View style={styles.bullets}>
        <View style={[styles.bulletsContainer, this.props.bulletsContainerStyle]}>
          {bullets}
        </View>
      </View>
    );
  }

  render() {
    const { size } = this.state;
    const children = this.props.children;
    let pages = [];

    if (children && children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        pages.push(children[i]);
      }
    } else if (children) {
      pages.push(children);
    } else {
      return (
        <Text style={{ backgroundColor: 'white' }}>
          You are supposed to add children inside Carousel
        </Text>
      );
    }

    pages = pages.map((page, i) =>
      <View style={[{ ...size }, this.props.pageStyle]} key={`page${i}`}>
        {page}
      </View>
    );

    const containerProps = {
      ref: (c) => { this.container = c; },
      onLayout: this._onLayout,
      style: [this.props.style],
    };

    const contents = (
      <ScrollView
        ref={(c) => { this.scrollView = c; }}
        onScrollBeginDrag={this._onScrollBegin}
        onMomentumScrollEnd={this._onScrollEnd}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        contentInset={{ top: 0 }}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        bounces={false}
        contentContainerStyle={[
          styles.horizontalScroll,
          this.props.contentContainerStyle,
          {
            width: size.width * (children.length),
            height: size.height,
          },
        ]}
      >
        {pages}
      </ScrollView>);

    return (
      <View {...containerProps}>
        {contents}
        {this.props.bullets && this._renderBullets(this.state.childrenLength)}
        {this.props.pageInfo && this._renderPageInfo(this.state.childrenLength)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  horizontalScroll: {
    position: 'absolute',
  },
  pageInfoBottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  pageInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pageInfoPill: {
    width: 80,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageInfoText: {
    textAlign: 'center',
  },
  bullets: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    height: 30,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bulletsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  chosenBullet: {
    margin: 10,
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  bullet: {
    margin: 10,
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
  },
});
