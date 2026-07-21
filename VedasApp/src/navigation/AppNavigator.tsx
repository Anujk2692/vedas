import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MiniAudioPlayer} from '../components/MiniAudioPlayer';
import {TextTranslateBar} from '../components/TextTranslateBar';
import {ScreenHeader, StackScreenHeader, TAB_HEADER_META} from '../components/ui/ScreenHeader';
import {VedasTabBar} from '../components/ui/VedasTabBar';
import {useAudioPlayer} from '../context/AudioPlayerContext';
import {AiGuruScreen} from '../screens/AiGuruScreen';
import {AartiDetailScreen} from '../screens/AartiDetailScreen';
import {AartiListScreen} from '../screens/AartiListScreen';
import {AudioPlayerScreen} from '../screens/AudioPlayerScreen';
import {AudioScreen} from '../screens/AudioScreen';
import {ChapterReaderScreen} from '../screens/ChapterReaderScreen';
import {CultureHubScreen} from '../screens/CultureHubScreen';
import {DeityDetailScreen} from '../screens/DeityDetailScreen';
import {FestivalDetailScreen} from '../screens/FestivalDetailScreen';
import {GyanScreen} from '../screens/GyanScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {MeditationTimerScreen} from '../screens/MeditationTimerScreen';
import {PdfViewerScreen} from '../screens/PdfViewerScreen';
import {QuizListScreen} from '../screens/QuizListScreen';
import {QuizPlayScreen} from '../screens/QuizPlayScreen';
import {SearchScreen} from '../screens/SearchScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {StudyPathDetailScreen} from '../screens/StudyPathDetailScreen';
import {TempleDetailScreen} from '../screens/TempleDetailScreen';
import {TopicDetailScreen} from '../screens/TopicDetailScreen';
import {VedaDetailScreen} from '../screens/VedaDetailScreen';
import {VideoPlayerScreen} from '../screens/VideoPlayerScreen';
import {VideoScreen} from '../screens/VideoScreen';
import {colors} from '../theme/colors';
import type {RootStackParamList, TabParamList} from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const HIDDEN_MINI_PLAYER_ROUTES = new Set(['AudioPlayer', 'VideoPlayer']);

function TranslateBarLayer({
  activeRoute,
  hasMiniPlayer,
}: {
  activeRoute: string;
  hasMiniPlayer: boolean;
}) {
  const tabOffset = activeRoute === 'MainTabs' ? 68 : 0;
  const miniPlayerOffset = hasMiniPlayer && !HIDDEN_MINI_PLAYER_ROUTES.has(activeRoute) ? 72 : 0;
  return <TextTranslateBar bottomOffset={tabOffset + miniPlayerOffset} />;
}

function MiniPlayerBar({activeRoute}: {activeRoute: string}) {
  const insets = useSafeAreaInsets();
  const {currentTrack} = useAudioPlayer();

  if (!currentTrack || HIDDEN_MINI_PLAYER_ROUTES.has(activeRoute)) {
    return null;
  }

  const bottomOffset = activeRoute === 'MainTabs' ? 68 : 0;

  return (
    <View
      style={[styles.miniPlayerWrap, {bottom: bottomOffset + insets.bottom}]}
      pointerEvents="box-none">
      <MiniAudioPlayer
        onExpand={() => {
          if (navigationRef.isReady()) {
            navigationRef.navigate('AudioPlayer');
          }
        }}
      />
    </View>
  );
}

function OverlayBars({activeRoute}: {activeRoute: string}) {
  const {currentTrack} = useAudioPlayer();
  return (
    <>
      <TranslateBarLayer
        activeRoute={activeRoute}
        hasMiniPlayer={!!currentTrack}
      />
      <MiniPlayerBar activeRoute={activeRoute} />
    </>
  );
}

function tabHeader(name: keyof TabParamList) {
  const meta = TAB_HEADER_META[name];
  return () => (
    <ScreenHeader
      title={meta.title}
      subtitle={meta.subtitle}
      icon={meta.icon}
    />
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <VedasTabBar {...props} />}
      screenOptions={{
        headerShadowVisible: false,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
      <Tab.Screen name="Gyan" component={GyanScreen} options={{header: tabHeader('Gyan')}} />
      <Tab.Screen
        name="Aarti"
        component={AartiListScreen}
        options={{header: tabHeader('Aarti')}}
      />
      <Tab.Screen
        name="Audio"
        component={AudioScreen}
        options={{header: tabHeader('Audio')}}
      />
      <Tab.Screen
        name="Video"
        component={VideoScreen}
        options={{header: tabHeader('Video')}}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{header: tabHeader('Search')}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{header: tabHeader('Settings')}}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const [activeRoute, setActiveRoute] = useState('MainTabs');

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        if (!navigationRef.isReady()) {
          return;
        }
        const route = navigationRef.getCurrentRoute();
        setActiveRoute(route?.name ?? 'MainTabs');
      }}>
      <View style={styles.root}>
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            contentStyle: {backgroundColor: colors.background},
          }}>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="VedaDetail"
            component={VedaDetailScreen}
            options={({route}) => ({
              header: () => (
                <StackScreenHeader
                  title={route.params.title}
                  subtitle="Chapters · philosophy · learning guides"
                />
              ),
            })}
          />
          <Stack.Screen
            name="ChapterReader"
            component={ChapterReaderScreen}
            options={({route}) => ({
              header: () => (
                <StackScreenHeader
                  title={route.params.title}
                  subtitle={route.params.vedaTitle ?? 'Sacred mantras & translations'}
                />
              ),
            })}
          />
          <Stack.Screen
            name="AartiDetail"
            component={AartiDetailScreen}
            options={({route}) => ({
              header: () => (
                <StackScreenHeader
                  title={route.params.title}
                  subtitle="PDF · latest singers · listen & watch"
                />
              ),
            })}
          />
          <Stack.Screen
            name="TopicDetail"
            component={TopicDetailScreen}
            options={({route}) => ({
              header: () => (
                <StackScreenHeader title={route.params.title} subtitle="ज्ञान विषय · Knowledge topic" />
              ),
            })}
          />
          <Stack.Screen
            name="StudyPathDetail"
            component={StudyPathDetailScreen}
            options={({route}) => ({
              header: () => (
                <StackScreenHeader title={route.params.title} subtitle="अध्ययन योजना · Study path" />
              ),
            })}
          />
          <Stack.Screen
            name="AiGuru"
            component={AiGuruScreen}
            options={{
              header: () => (
                <StackScreenHeader title="AI Guru" subtitle="शास्त्र-आधारित मार्गदर्शन" />
              ),
            }}
          />
          <Stack.Screen
            name="MeditationTimer"
            component={MeditationTimerScreen}
            options={{
              header: () => (
                <StackScreenHeader title="Meditation Timer" subtitle="ध्यान · Daily practice" />
              ),
            }}
          />
          <Stack.Screen
            name="QuizList"
            component={QuizListScreen}
            options={{
              header: () => (
                <StackScreenHeader title="Daily Quiz" subtitle="Learn · Check · Grow" />
              ),
            }}
          />
          <Stack.Screen
            name="QuizPlay"
            component={QuizPlayScreen}
            options={({route}) => ({
              header: () => (
                <StackScreenHeader title={route.params.title} subtitle="Interactive learning" />
              ),
            })}
          />
          <Stack.Screen
            name="CultureHub"
            component={CultureHubScreen}
            options={{
              header: () => (
                <StackScreenHeader
                  title="Deities · Temples · Festivals"
                  subtitle="Temple guide & Sanatan culture"
                />
              ),
            }}
          />
          <Stack.Screen
            name="DeityDetail"
            component={DeityDetailScreen}
            options={({route}) => ({
              header: () => (
                <StackScreenHeader title={route.params.title} subtitle="Gods & Goddesses" />
              ),
            })}
          />
          <Stack.Screen
            name="TempleDetail"
            component={TempleDetailScreen}
            options={({route}) => ({
              header: () => (
                <StackScreenHeader title={route.params.title} subtitle="Temple guide" />
              ),
            })}
          />
          <Stack.Screen
            name="FestivalDetail"
            component={FestivalDetailScreen}
            options={({route}) => ({
              header: () => (
                <StackScreenHeader title={route.params.title} subtitle="Festival guide" />
              ),
            })}
          />
          <Stack.Screen
            name="PdfViewer"
            component={PdfViewerScreen}
            options={{headerShown: true}}
          />
          <Stack.Screen
            name="AudioPlayer"
            component={AudioPlayerScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="VideoPlayer"
            component={VideoPlayerScreen}
            options={({route}) => ({
              header: () => (
                <StackScreenHeader
                  variant="dark"
                  title={route.params.title}
                  subtitle={route.params.subtitle ?? 'Sacred video patha'}
                />
              ),
            })}
          />
        </Stack.Navigator>
        <OverlayBars activeRoute={activeRoute} />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  miniPlayerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
  },
});
