import { useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type ButtonProps = {
  children: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
};

function CalcButton({
  children,
  onPress,
  style,
  textStyle,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
    >
      <Animated.View
        style={[
          styles.button,
          style,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={[styles.buttonText, textStyle]}>
          {children}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export default function HomeScreen() {
  const [display, setDisplay] = useState('0');
  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForSecondNumber, setWaitingForSecondNumber] =
    useState(false);

  const displayScale = useRef(new Animated.Value(1)).current;

  const animateDisplay = () => {
    Animated.sequence([
      Animated.timing(displayScale, {
        toValue: 0.96,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.spring(displayScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 25,
        bounciness: 5,
      }),
    ]).start();
  };

  const pressNumber = (number: string) => {
    animateDisplay();

    if (waitingForSecondNumber) {
      setDisplay(number);
      setWaitingForSecondNumber(false);
      return;
    }

    if (display === '0' || display === 'Błąd') {
      setDisplay(number);
    } else {
      setDisplay(display + number);
    }
  };

  const pressDecimal = () => {
    animateDisplay();

    if (display === 'Błąd' || waitingForSecondNumber) {
      setDisplay('0.');
      setWaitingForSecondNumber(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const pressOperation = (nextOperation: string) => {
    animateDisplay();

    const currentNumber = Number(display);

    if (firstNumber === null) {
      setFirstNumber(currentNumber);
    }

    setOperation(nextOperation);
    setWaitingForSecondNumber(true);
  };

  const calculate = () => {
    animateDisplay();

    if (firstNumber === null || operation === null) {
      return;
    }

    const secondNumber = Number(display);
    let result = 0;

    if (operation === '+') {
      result = firstNumber + secondNumber;
    } else if (operation === '-') {
      result = firstNumber - secondNumber;
    } else if (operation === '×') {
      result = firstNumber * secondNumber;
    } else if (operation === '÷') {
      if (secondNumber === 0) {
        setDisplay('Błąd');
        setFirstNumber(null);
        setOperation(null);
        setWaitingForSecondNumber(true);
        return;
      }

      result = firstNumber / secondNumber;
    }

    setDisplay(String(result));
    setFirstNumber(null);
    setOperation(null);
    setWaitingForSecondNumber(true);
  };

  const clear = () => {
    animateDisplay();

    setDisplay('0');
    setFirstNumber(null);
    setOperation(null);
    setWaitingForSecondNumber(false);
  };

  const toggleSign = () => {
    animateDisplay();

    if (display === '0' || display === 'Błąd') {
      return;
    }

    if (display.startsWith('-')) {
      setDisplay(display.substring(1));
    } else {
      setDisplay('-' + display);
    }
  };

  const percent = () => {
    animateDisplay();

    if (display === 'Błąd') {
      return;
    }

    setDisplay(String(Number(display) / 100));
  };

  const operationLabel =
    operation !== null
      ? 'OPERACJA ' + operation
      : 'GOTOWY';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>CALCULATOR</Text>
          <Text style={styles.subtitle}>PREMIUM EDITION</Text>
        </View>

        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <Animated.View
        style={[
          styles.displayContainer,
          {
            transform: [{ scale: displayScale }],
          },
        ]}
      >
        <Text style={styles.smallLabel}>
          {operationLabel}
        </Text>

        <Text
          style={styles.display}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.35}
        >
          {display}
        </Text>
      </Animated.View>

      <View style={styles.buttons}>
        <View style={styles.row}>
          <CalcButton
            onPress={clear}
            style={styles.specialButton}
            textStyle={styles.specialText}
          >
            AC
          </CalcButton>

          <CalcButton
            onPress={toggleSign}
            style={styles.specialButton}
            textStyle={styles.specialText}
          >
            +/−
          </CalcButton>

          <CalcButton
            onPress={percent}
            style={styles.specialButton}
            textStyle={styles.specialText}
          >
            %
          </CalcButton>

          <CalcButton
            onPress={() => pressOperation('÷')}
            style={styles.operationButton}
            textStyle={styles.operationText}
          >
            ÷
          </CalcButton>
        </View>

        <View style={styles.row}>
          <CalcButton onPress={() => pressNumber('7')}>
            7
          </CalcButton>

          <CalcButton onPress={() => pressNumber('8')}>
            8
          </CalcButton>

          <CalcButton onPress={() => pressNumber('9')}>
            9
          </CalcButton>

          <CalcButton
            onPress={() => pressOperation('×')}
            style={styles.operationButton}
            textStyle={styles.operationText}
          >
            ×
          </CalcButton>
        </View>

        <View style={styles.row}>
          <CalcButton onPress={() => pressNumber('4')}>
            4
          </CalcButton>

          <CalcButton onPress={() => pressNumber('5')}>
            5
          </CalcButton>

          <CalcButton onPress={() => pressNumber('6')}>
            6
          </CalcButton>

          <CalcButton
            onPress={() => pressOperation('-')}
            style={styles.operationButton}
            textStyle={styles.operationText}
          >
            −
          </CalcButton>
        </View>

        <View style={styles.row}>
          <CalcButton onPress={() => pressNumber('1')}>
            1
          </CalcButton>

          <CalcButton onPress={() => pressNumber('2')}>
            2
          </CalcButton>

          <CalcButton onPress={() => pressNumber('3')}>
            3
          </CalcButton>

          <CalcButton
            onPress={() => pressOperation('+')}
            style={styles.operationButton}
            textStyle={styles.operationText}
          >
            +
          </CalcButton>
        </View>

        <View style={styles.row}>
          <CalcButton
            onPress={() => pressNumber('0')}
            style={styles.zeroButton}
          >
            0
          </CalcButton>

          <CalcButton onPress={pressDecimal}>
            .
          </CalcButton>

          <CalcButton
            onPress={calculate}
            style={styles.operationButton}
            textStyle={styles.operationText}
          >
            =
          </CalcButton>
        </View>
      </View>

      <Text style={styles.footer}>
        DESIGNED FOR IPHONE
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080A',
    paddingHorizontal: 18,
    paddingBottom: 12,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 5,
  },

  logo: {
    color: '#F4F4F6',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 3.5,
  },

  subtitle: {
    color: '#60636B',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 2.5,
    marginTop: 5,
  },

  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#111216',
    borderWidth: 1,
    borderColor: '#22242A',
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9500',
  },

  liveText: {
    color: '#8A8D95',
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 7,
    paddingBottom: 25,
  },

  smallLabel: {
    color: '#5E6169',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 7,
  },

  display: {
    color: '#F7F7F8',
    fontSize: 76,
    fontWeight: '200',
    letterSpacing: -3,
  },

  buttons: {
    gap: 12,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  button: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 31,
    backgroundColor: '#17191E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#24262C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 7,
  },

  specialButton: {
    backgroundColor: '#24262C',
    borderColor: '#2D3037',
  },

  operationButton: {
    backgroundColor: '#FF9500',
    borderColor: '#FFAA33',
    shadowColor: '#FF9500',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  zeroButton: {
    flex: 2,
    aspectRatio: 2.05,
    alignItems: 'flex-start',
    paddingLeft: 30,
  },

  buttonText: {
    color: '#F4F4F6',
    fontSize: 29,
    fontWeight: '400',
  },

  specialText: {
    color: '#D7D8DC',
    fontSize: 21,
    fontWeight: '600',
  },

  operationText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '500',
  },

  footer: {
    textAlign: 'center',
    color: '#3E4148',
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 12,
  },
});
