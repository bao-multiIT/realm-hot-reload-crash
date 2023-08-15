import {createRealmContext} from '@realm/react';
import React, {useState} from 'react';
import {FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Realm from 'realm';

// Define your object model
class Profile extends Realm.Object<Profile> {
  id!: number;
  name!: string;

  static schema = {
    name: 'Profile',
    properties: {
      id: 'int',
      name: 'string',
    },
    primaryKey: 'id',
  };
}

// Create a configuration object
const realmConfig: Realm.Configuration = {
  schema: [Profile],
  deleteRealmIfMigrationNeeded: true,
};

// Create a realm context
const {RealmProvider, useRealm, useQuery} = createRealmContext(realmConfig);

const App = () => {
  return (
    <RealmProvider>
      <ChildComponent />
    </RealmProvider>
  );
};

const ChildComponent = () => {
  const profiles = useQuery(Profile);

  const realm = useRealm();

  const [name, setName] = useState('');

  const handleCreatePress = () => {
    realm.write(() => {
      realm.create('Profile', {
        name: name,
        id: profiles.length + 1,
      });
    });
  };

  return (
    <View
      style={{
        padding: 12,
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 12,
        }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'black',
            flex: 1,
            color: 'black',
          }}
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: 'black',
            paddingHorizontal: 10,
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={handleCreatePress}>
          <Text
            style={{
              color: 'black',
            }}>
            Create
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={profiles}
        renderItem={({item}) => {
          return (
            <View
              style={{
                borderWidth: 1,
                borderColor: 'black',
                marginTop: 12,
                padding: 12,
              }}>
              <Text
                style={{
                  color: 'black',
                }}>
                {item.name}
              </Text>
            </View>
          );
        }}
        keyExtractor={profile => profile.id + ''}
      />
    </View>
  );
};

export default App;
