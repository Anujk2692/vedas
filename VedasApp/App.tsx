import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AudioPlayerProvider} from './src/context/AudioPlayerContext';
import {LanguageProvider} from './src/context/LanguageContext';
import {SubscriptionProvider} from './src/context/SubscriptionContext';
import {TextTranslateProvider} from './src/context/TextTranslateContext';
import {UserPreferencesProvider} from './src/context/UserPreferencesContext';
import {AppNavigator} from './src/navigation/AppNavigator';
import {colors} from './src/theme/colors';

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <LanguageProvider>
          <TextTranslateProvider>
            <UserPreferencesProvider>
              <SubscriptionProvider>
                <AudioPlayerProvider>
                  <StatusBar
                    barStyle="dark-content"
                    backgroundColor={colors.background}
                  />
                  <AppNavigator />
                </AudioPlayerProvider>
              </SubscriptionProvider>
            </UserPreferencesProvider>
          </TextTranslateProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
