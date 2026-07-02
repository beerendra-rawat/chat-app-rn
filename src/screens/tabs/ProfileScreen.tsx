import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../../navigation/types';

export default function ProfileScreen() {
  const navigation = useNavigation<RootStackScreenProps<'ChatDetail'>['navigation']>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
      <Button
        title="Go to Chat Detail"
        onPress={() => navigation.navigate('ChatDetail', { chatId: '123' })}
      />
    </View>
  );
}