import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_POINTS = {
  INITIAL: SCREEN_HEIGHT * 0.25,
  EXPANDED: SCREEN_HEIGHT * 0.50,
  FULL: SCREEN_HEIGHT * 0.85,
};
const DRAG_THRESHOLD = 50;

export type BottomSheetRef = {
  present: () => void;
  dismiss: () => void;
};

interface BottomSheetProps {
  title?: string;
  children?: React.ReactNode;
  isFullHeight?: boolean;
  dismissThreshold?: number; 
  enableDragging?: boolean;
  snapToPoints?: boolean;
  
}




const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ 
    title = "Bottom Sheet", 
    children,
    isFullHeight = false,
    dismissThreshold = DRAG_THRESHOLD,
    enableDragging = true,
    snapToPoints = false }, ref) => {
    const [visible, setVisible] = useState(false);
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    
    const sheetHeight = isFullHeight ? SNAP_POINTS.FULL : SNAP_POINTS.EXPANDED;

    const getAvailableSnapPoints = () => {
      if (isFullHeight) {
        return [0, SNAP_POINTS.EXPANDED - SNAP_POINTS.FULL, SCREEN_HEIGHT];
      }
      return [0, SNAP_POINTS.INITIAL - SNAP_POINTS.EXPANDED, SCREEN_HEIGHT];
    }
    const getClosestSnapPoint = (panY: number) => {
      const availablePoints = getAvailableSnapPoints();
      return availablePoints.reduce((prev, curr) => Math.abs(curr - panY) < Math.abs(prev - panY) ? curr : prev)
    }
    // Create pan responder for handling drag gestures
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => enableDragging,
        onMoveShouldSetPanResponder: () => enableDragging,
        onPanResponderMove: (_, gestureState) => {
          // Only allow dragging downward
          if ( snapToPoints ||gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (snapToPoints){
            const closestSnapPoint = getClosestSnapPoint(gestureState.dy);
            if (closestSnapPoint === SCREEN_HEIGHT){
              dismiss()
            } else {
              Animated.spring(translateY, {
                toValue: closestSnapPoint,
                useNativeDriver: true,
                tension: 50, 
                friction: 7,
              }).start()
            }

          } else {
          if (gestureState.dy > dismissThreshold) {
            // Dismiss if dragged down past threshold
            dismiss();
          } else {
            // Snap back to position
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }).start();
          }
        }
        },
      })
    ).current;

    const present = () => {
      console.log('Presenting custom bottom sheet');
      setVisible(true);
    };

    const dismiss = () => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
        translateY.setValue(SCREEN_HEIGHT);
      });
    };

    // Animate bottom sheet when it becomes visible
    useEffect(() => {
      if (visible) {
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            tension: 50,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [visible, translateY, backdropOpacity]);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      present,
      dismiss,
    }));

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="none"
        statusBarTranslucent={true}
        onRequestClose={dismiss}
      >
        <View style={styles.container}>
          {/* Backdrop */}
          <TouchableWithoutFeedback onPress={dismiss}>
            <Animated.View
              style={[
                styles.backdrop,
                { opacity: backdropOpacity }
              ]}
            />
          </TouchableWithoutFeedback>

          {/* Bottom Sheet */}
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                transform: [{ translateY: translateY }],
                height: sheetHeight,
              },
            ]}
          >
            {/* Handle for dragging */}
            <View style={styles.handle} {...panResponder.panHandlers}>
              <View style={styles.handleIndicator} />
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
              <Text style={styles.titleText}>{title}</Text>
              {children || (
                <Text style={styles.defaultContent}>
                  Include details
                </Text>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  handle: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  handleIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  defaultContent: {
    fontSize: 16,
    color: 'gray',
  },
});

export default BottomSheet;
