import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
// types.ts
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';





export type PlayerScreenProps = {
    route: PlayerScreenRouteProp;
    navigation: PlayerScreenNavigationProp;
};

export type RootStackParamList = {
    SignIn: undefined;
    Home: undefined;
    SignUp: undefined;
    PodcastsScreen: undefined;
    PlayerScreen: { podcast: { url: string; title: string } };
};

// Define your navigation prop type
export type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;
export type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'PlayerScreen'>;
export type PlayerScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<RootStackParamList, 'PlayerScreen'>,
    StackNavigationProp<RootStackParamList>
>;
