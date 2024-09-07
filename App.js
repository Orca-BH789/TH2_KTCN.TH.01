import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import * as math from 'mathjs';


export default function App() {
  const [currentInput, setCurrentInput] = useState('');
  const [result, setResult] = useState('');
  const [showScientific, setShowScientific] = useState(false);
  const [isRadians, setIsRadians] = useState(false);   
  
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
    <View style={styles.container}>
      <View style={styles.display}>
      <Text style={[styles.inputText, { fontSize: getFontSize(currentInput) }]}>{currentInput}</Text>
      <Text style={[styles.resultText, { fontSize: getFontSize(result) + 10 }]}>{result}</Text>
     
      </View>
  
    
      <TouchableOpacity onPress={() => setShowScientific(!showScientific)}>
        <Text style={styles.toggleButton}>{showScientific ? '≡' : '≡'}</Text>
      </TouchableOpacity>
  

      {showScientific && (
        <View style={styles.scientificButtons}>
          {['sin', 'cos', 'tan', 'cot', 'log', 'ln', '(', ')', '^', '√', '!', 'π', 'e', isRadians ? 'RAD' : 'DEG' ].map((btn) => (
            <TouchableOpacity key={btn} style={styles.Sc_button} onPress={() => handlePress(btn)}>
              <Text style={styles.Sc_buttonText}>{btn}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
  
     <View style={styles.buttons}>
        {['C', '%', 'Del', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '00', '0', ',', '='].map((btn) => (
          <TouchableOpacity key={btn} style={styles.St_button} onPress={() => handlePress(btn)}>
            {btn === 'Del' ? (
              <Feather name="delete" size={24} color="black" />
            ) : (
              <Text style={styles.buttonText}>{btn}</Text>
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
      backgroundColor: '#fff',
    },
    display: {
      flex: 1,
      backgroundColor: '#f8f5f2',
      justifyContent: 'center',
      alignItems: 'flex-end',
      padding: 20,
      marginTop: 20,
    },
    inputText: {      
      color: '#333',
    },
    resultText: {     
      fontWeight: 'bold',
      color: '#000',
    },
    scientificButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      backgroundColor: '#232946',
     
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
      color: '#333',
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
  });
  