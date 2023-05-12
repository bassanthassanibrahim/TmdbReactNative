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
  Picker,
} from 'react-native';
import { Card, Searchbar } from 'react-native-paper';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating-widget';


const FilterScreen = ({ route, navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [genreData, setGenreData] = useState([]);

const [numberStar, setnStar]=useState('');
  

 const ref = React.useRef(0);

 const [pageNo, setPageNo] = useState(1);
 const [itemId, setitemId] = React.useState(null);
 const [path, setposterPath] = React.useState(null);

  const { genre,navigateGenre} = route.params; 

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


  const onPress = () => console.log('Button Clicked');
  const [selectedGenre, setSelectedGenre] = useState(null);
  if (selectedGenre==null){
    setSelectedGenre(genre)
  }
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedSort, setSelectedSort] = useState('popularity.desc');

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
      'https://api.themoviedb.org/3/discover/movie?api_key=fe73570f16e8e63b8a3e86436a277255&language='+selectedLang+'&sort_by='+selectedSort+'&page='+pageNo+'&with_genres='+selectedGenre+'&with_watch_monetization_types=flatrate'
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [pageNo, navigateGenre, selectedLang, selectedGenre, selectedSort]);

  return (
    <ScrollView ref={ref} style={styles.container}>
      {isLoading ? (
        <Text style={styles.header}>Loading...</Text>
      ) : (
        <View>

        <View style={{borderRadius: 4, margin:10}}>
        <Picker
          style={{ fontSize: 16,
          height:40,
          borderRadius:5,
           color: 'black',
           backgroundColor:'#c4dbe0',
           textAlign: 'center',
           fontWeight: 'bold' }}
          selectedValue={selectedGenre}
          onValueChange={(itemValue, itemIndex) =>
          setSelectedGenre(itemValue)
          }
>
          
          <Picker.Item label="Action" value={28} />
          <Picker.Item label="Adventure" value={12} />
          <Picker.Item label="Animation" value={16} />
          <Picker.Item label="Comedy" value={35} />
          <Picker.Item label="Crime" value={80} />
          <Picker.Item label="Drama" value={18} />
          <Picker.Item label="History" value={12} />
          <Picker.Item label="Documentary" value={99} />
          <Picker.Item label="Family" value={10751} />
          <Picker.Item label="Fantasy" value={14} />
          <Picker.Item label="History" value={36} />
          <Picker.Item label="Horror" value={27} />
          <Picker.Item label="Music" value={10402} />
          <Picker.Item label="Mystery" value={9648} />
          <Picker.Item label="Romance" value={10749} />
          <Picker.Item label="Science Fiction" value={878} />    
          <Picker.Item label="TV Movie" value={10770} />
          <Picker.Item label="Thriller" value={53} />
          <Picker.Item label="War" value={10752} />
          <Picker.Item label="Westren" value={37} />
        </Picker>
        </View>

        <Text style={styles.label}>
          Language:
        </Text>

        <View style={{borderRadius: 4, margin:10}}>
        <Picker
          style={{ fontSize: 16,
          height:40,
          width:250,
          borderRadius:5,
           color: 'black',
           backgroundColor:'#c4dbe0',
           textAlign: 'center',
           fontWeight: 'bold' }}
          selectedValue={selectedLang}
          onValueChange={(itemValue, itemIndex) =>
          setSelectedLang(itemValue)
          }
>
          <Picker.Item label="English" value='en' />
          <Picker.Item label="Spanish" value='es' />
          <Picker.Item label="Russian" value='ru' />
          <Picker.Item label="German" value='de' />
          <Picker.Item label="French" value='fr' />
          <Picker.Item label="Chinese" value='zh' />
        </Picker>
        </View>

        <Text style={styles.label}>
            Sort By:
        </Text>

        <View style={{ borderRadius: 4, margin:10}}>
        <Picker
          style={{ fontSize: 16,
          height:40,
          width:250,
          borderRadius:5,
           color: 'black',
           backgroundColor:'#c4dbe0',
           textAlign: 'center',
           fontWeight: 'bold' }}
          selectedValue={selectedSort}
          onValueChange={(itemValue, itemIndex) =>
          setSelectedSort(itemValue)
          }
>
          <Picker.Item label="Popularity: High->Low" value='popularity.desc' />
          <Picker.Item label="Popularity: Low->High" value='popularity.asc' />
          <Picker.Item label="Vote Count: High->Low" value='vote_count.desc' />
          <Picker.Item label="Vote Count: Low->High" value='vote_count.asc' />
          <Picker.Item label="Revenue: High->Low" value='revenue.desc' />
          <Picker.Item label="Revenue: Low->High" value='revenue.asc' />
        </Picker>
        </View>

          <Text style={styles.label}>
            Total Search Results: {data.total_results}
          </Text>

          <Text style={styles.label}>
              Page: {pageNo}/{data.total_pages}
          </Text>

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
  button: {
    alignSelf:'center',
    alignItems: "center",
    backgroundColor: '#fe893a',
    margin:10,
    height:25,
    width:100,
    borderRadius:20,
  },
  header: {
    margin: 15,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'#fe893a'
  },
});

export default FilterScreen;
