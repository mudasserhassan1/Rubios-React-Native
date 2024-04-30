import styles from './styles';
import {FlatList, SafeAreaView, TouchableOpacity} from 'react-native';
import Divider from '../../components/Divider';
import useAccountHook from './useAccountHook';
import RText from '../../components/RText';

const Account = () => {
  const {accountTilesList, handleRedirections} = useAccountHook();

  const renderAccountItemView = item => {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => handleRedirections(item.item.title)}>
        <RText text={item.item.title} textStyle={styles.title} />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Divider}
        data={accountTilesList}
        keyExtractor={item => item.title}
        renderItem={renderAccountItemView}
      />
    </SafeAreaView>
  );
};
export default Account;
