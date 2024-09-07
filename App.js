import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Appearance, Animated } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import * as math from 'mathjs';


export default function App() {
  const [currentInput, setCurrentInput] = useState('');
  const [result, setResult] = useState('');
  const [showScientific, setShowScientific] = useState(false);
  const [isRadians, setIsRadians] = useState(false);   
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });
    return () => subscription.remove();
  }, []);

  const toggleDarkMode = () => {
    Animated.timing(fadeAnim, {
      toValue: 800,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setIsDarkMode(!isDarkMode);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    });
  };

  const getThemeColors = () => ({
    backgroundColor: isDarkMode ? '#121212' : '#fff',
    textColor: isDarkMode ? '#fff' : '#000',
    buttonColor: isDarkMode ? '#333' : '#f0f0f0',
    scientificBgColor: isDarkMode ? '#1e1e1e' : '#232946',
    displayBgColor: isDarkMode ? '#1e1e1e' : '#f8f5f2',
  });

  const theme = getThemeColors();

  const dynamicStyles = {
    container: {
      backgroundColor: theme.backgroundColor,
    },
    display: {
      backgroundColor: theme.displayBgColor,
    },
    inputText: {
      color: theme.textColor,
    },
    resultText: {
      color: theme.textColor,
    },
    scientificButtons: {
      backgroundColor: theme.scientificBgColor,
    },
    St_button: {
      backgroundColor: theme.buttonColor,
    },
    buttonText: {
      color: theme.textColor,
    },
    toggleButton: {
      color: theme.textColor,
    },
  };

  const handlePress = (input) => {
    if (input === '=') {
      if (currentInput === '' || ['+', '-', '×', '÷'].includes(currentInput.slice(-1))) {
        setResult('0');
      } else {
        calculateResult();
      }
      return;
    }
  
    if (input === 'C') {
      setCurrentInput('');
      setResult('');
      return;
    }
  
    if (input === 'Del') {
      setCurrentInput(currentInput.slice(0, -1));
      return;
    }
  
    if (['+', '-', '×', '÷'].includes(input)) {
      if (currentInput === '' || ['+', '×', '÷'].includes(currentInput.slice(-1)) || (input === '-' && currentInput.slice(-1) === '-')) return;
      setCurrentInput(currentInput + input);
      return;
    }
  
    if (['sin', 'cos', 'tan', 'cot', 'log', 'ln', '√'].includes(input)) {
      setCurrentInput(currentInput + input + '(');
      return;
    }
    if (['π', 'e', '^','!'].includes(input)) {
      setCurrentInput(currentInput + input);
      return;
    }    
  
    if (input === 'RAD') {
      setIsRadians(false);
      return;
    }
  
    if (input === 'DEG') {
      setIsRadians(true);
      return;
    }
  
    if (input === '%') {
      if (currentInput !== '' && !isNaN(currentInput)) {
        setCurrentInput((parseFloat(currentInput) / 100).toString());
      }
      return;
    }
  
    if (input === ',' || input === '00' || input === '0') {
      const lastNumber = currentInput.split(/[\+\-\×\÷]/).pop();
  
      if (input === ',' && !lastNumber.includes(',')) {
        setCurrentInput(prevInput => prevInput + ',');
      } else if (input === '00' && lastNumber !== '0' && lastNumber !== '') {
        setCurrentInput(prevInput => prevInput + '00');
      } else if (input === '0' && (lastNumber !== '0' || lastNumber.includes(','))) {
        setCurrentInput(prevInput => prevInput + '0');
      }
      return;
    }   
    setCurrentInput(currentInput + input);
  };
  
  const balanceParentheses = (expression) => {
    let openCount = 0;
    let closeCount = 0; 
    
    for (let i = 0; i < expression.length; i++) {
      if (expression[i] === '(') {
        openCount++;
      } else if (expression[i] === ')') {
        closeCount++;
      }
    }  
    while (openCount > closeCount) {
      expression += ')';
      closeCount++;
    }  
    return expression;
  };
 
  
  const calculateResult = () => {
    try {
      let expression = currentInput
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/,/g, '.')
        .replace(/sin\(/g, isRadians ? 'sin(' : 'sin((PI / 180) * ')
        .replace(/cot\(/g, isRadians ? 'cot(' : 'cot((PI / 180) * ')
        .replace(/cos\(/g, isRadians ? 'cos(' : 'cos((PI / 180) * ')
        .replace(/tan\(/g, isRadians ? 'tan(' : 'tan((PI / 180) * ')
        .replace(/log\(/g, 'log10(')
        .replace(/(\d+)!/g,'factorial($1)')
        .replace(/ln\(/g,  'log(')
        .replace(/π/g, 'PI')
        .replace(/e/g, 'E')        
        .replace(/√\(/g, 'sqrt(');
  
        expression = balanceParentheses(expression);
        console.log(expression, isRadians);
        const calculated = math.evaluate(expression).toString();         
       
        setResult(calculated);
        
     // setCurrentInput(calculated);
    } catch (error) {
      setResult('Error');
      console.log(error);
    }
  };
   
  const getFontSize = (text) => {
    const length = text.length;
    if (length <= 10) return 38;
    if (length <= 20) return 26;
    if (length <= 30) return 18;
    return 20;
  };  

  
  

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <TouchableOpacity style={styles.darkModeToggle} onPress={toggleDarkMode}>
        <Feather name={isDarkMode ? 'sun' : 'moon'} size={24} color={theme.textColor} />
      </TouchableOpacity>
      <View style={[styles.display, dynamicStyles.display]}>
        <Text style={[styles.inputText, dynamicStyles.inputText, { fontSize: getFontSize(currentInput) }]}>{currentInput}</Text>
        <Text style={[styles.resultText, dynamicStyles.resultText, { fontSize: getFontSize(result) + 10 }]}>{result}</Text>
      </View>

      <TouchableOpacity onPress={() => setShowScientific(!showScientific)}>
        <Text style={[styles.toggleButton, dynamicStyles.toggleButton]}>{showScientific ? '≡' : '≡'}</Text>
      </TouchableOpacity>

      {showScientific && (
        <Animated.View style={[styles.container, dynamicStyles.container, { opacity: fadeAnim }]}> style={[styles.scientificButtons, dynamicStyles.scientificButtons]}>
          {['sin', 'cos', 'tan', 'cot', 'log', 'ln', '(', ')', '^', '√', '!', 'π', 'e', isRadians ? 'RAD' : 'DEG'].map((btn) => (
            <TouchableOpacity key={btn} style={styles.Sc_button} onPress={() => handlePress(btn)}>
              <Text style={styles.Sc_buttonText}>{btn}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      <View style={styles.buttons}>
        {['C', '%', 'Del', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '00', '0', ',', '='].map((btn) => (
          <TouchableOpacity key={btn} style={[styles.St_button, dynamicStyles.St_button]} onPress={() => handlePress(btn)}>
            {btn === 'Del' ? (
              <Feather name="delete" size={24} color={theme.textColor} />
            ) : (
              <Text style={[styles.buttonText, dynamicStyles.buttonText]}>{btn}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  display: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
    marginTop: 20,
  },
  inputText: {
    marginBottom: 5,
  },
  resultText: {
    fontWeight: 'bold',
  },
  scientificButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  Sc_button: {
    width: '20%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  St_button: {
    width: '25%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 28,
  },
  Sc_buttonText: {
    fontSize: 18,
    color: '#fffffe',
  },
  toggleButton: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
  },
  darkModeToggle: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});
  