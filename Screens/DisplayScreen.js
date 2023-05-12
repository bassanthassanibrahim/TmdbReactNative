import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Linking,
  Alert,
  ImageBackground,
} from 'react-native';
import { Card, Searchbar } from 'react-native-paper';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating-widget';


const DisplayScreen = ({ route, navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

const [numberStar, setnStar]=useState('');

  

  const ref = React.useRef(0);

  const [pageNo, setPageNo] = useState(1);
 const [itemId, setitemId] = React.useState(null);
 const [path, setposterPath] = React.useState(null);


  const { title } = route.params;
  let searchTitle = title;

  const [searchQuery, setSearchQuery] = React.useState(null);
  const onChangeSearch = query => setSearchQuery(query);

  const onSearchPress = () => {
    navigation.push('DisplayScreen',{title:searchQuery})
  }

  async function alertIfSpeaking(description) {
    let speaking = await Speech.isSpeakingAsync();
    if (speaking) {
      Speech.stop();
    } else {
      Speech.speak(description);
    }
  }

  const inCaseNoResults = (result) => {
    if (result==0)
    {
      return <Text
        style={{ textAlign: 'left', flexWrap: 'wrap', margin: 10, color:'#ebf3f5' }}>
        Sorry we couldn't understand you 😔{'\n'}
        Please Try Again...
      </Text>
    }
  }

  const onPressPrev = () => {
    if (pageNo != 1) {
      setPageNo(pageNo - 1);
      ref.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const onPressNext = () => {
    if (pageNo!=data.total_pages)
    {
      setPageNo(pageNo + 1);
      ref.current.scrollTo(0);
    }
  };

  const insertImage = (path) => {

    if (path!=null)
    {
      return <Image
                style={styles.image}
                source={{ 
                  uri:
                    'https://image.tmdb.org/t/p/w185/' + path,
                }}
              />
    }

    else{
      return <Image
                style={styles.image}
                source={{ 
                  uri:
                    'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/red-(2016)-et00046748-21-09-2016-06-28-07.jpg'
                }}
              />
    }
  }

  useEffect(() => {
    fetch(
      'https://api.themoviedb.org/3/search/movie?api_key=fe73570f16e8e63b8a3e86436a277255&query=' +
        searchTitle +
        '&page=' +
        pageNo
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [pageNo]);


  return (
    <ScrollView ref={ref} style={styles.container}>
      {isLoading ? (
          <Text style={styles.header}>Loading...</Text>
      ) : (
        <View>
          <Searchbar
          style={{margin:10, backgroundColor:'#c4dbe0'}}
          placeholder={searchTitle}
          onChangeText={onChangeSearch}
          value={searchQuery}
          onIconPress = {onSearchPress}
          onSubmitEditing={onSearchPress}
        />
        
          <Text style={styles.label}>
            Total Search Results: {data.total_results}
          </Text>

          <Text style={styles.label}>
            Page: {pageNo}/{data.total_pages}
          </Text>

          {inCaseNoResults(data.total_results)}

          <FlatList
            data={data.results}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (

              <TouchableOpacity
                      onPress={() => {
                      navigation.navigate('MovieScreen',{id:item.id,poster:item.poster_path, detail:item.overview, title:item.title, realse:item.release_date, rating:item.vote_average});  
                      }}>
              
                <Card style={{ margin: 5, backgroundColor: '#465461' }}>

                  <View style={{flexDirection:'row'}}>

                  {insertImage(item.poster_path)}

                    <View style={{flexDirection:'column', flex:1}}>

                        <Text
                          style={{
                            marginTop:10,
                            marginBottom: 10,
                            fontWeight: 'bold',
                            textAlign: 'left',
                            marginLeft: 10,
                            marginRight: 10,
                            flexWrap:'wrap',
                            color:'#ebf3f5',
                          }}
                          adjustsFontSizeToFit={true}
                          >
                          {item.original_title}
                        </Text>

                        <View>
                        <StarRating     
                                rating={item.vote_average/2}
                                onChange={setnStar}
                                maxStars={5}	
                                color='yellow'	
                                starSize={25}
                              />
                        </View>

                        <Text
                          style={{
                            marginTop:5,
                            marginLeft: 10,
                            color:'#ebf3f5',
                          }}>
                          Vote Count: {item.vote_count}
                        </Text>

                        <Text
                          style={{
                            marginTop:15,
                            marginLeft: 10,
                            color:'#ebf3f5',
                          }}>
                          {item.overview}
                        </Text>

                    </View>

                  </View>  

                </Card>
              </TouchableOpacity>
              
            )}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginBottom: 50,
              marginTop: 20,
            }}>
            <TouchableOpacity style={styles.navButtons} onPress={onPressPrev}>
              <Text style={{ color: 'white', fontWeight: 'bold', margin: 3 }}>
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButtons} onPress={onPressNext}>
              <Text style={{ color: 'white', fontWeight: 'bold', margin: 3 }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#272e38',
    padding: '7.5%',
    paddingTop: Constants.statusBarHeight,
  },

  image: {
    height: 200,
    width: 133.32,
    alignSelf: 'center',
    margin: 10,
  },
  label: {
    marginTop: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    textAlign: 'left',
    color:'#ebf3f5',
  },
  navButtons: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#fe893a',
    margin: 5,
    height: 25,
    width: 70,
    borderRadius: 20,
  },
  speakerIcon: {
    height: 20,
    width: 20,
    alignSelf: 'center',
    margin: 10,
  },
  header: {
    marginTop:20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'#fe893a'
  },
});

export default DisplayScreen;
