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
  Modal,
} from 'react-native';
import { Card } from 'react-native-paper';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating-widget';

const MovieDetailedScreen = ({ route, navigation }) => {
const [videoData, setVideoData] = useState([]);
const [similarData, setSimilarData] = useState([]);
const [reviewsData, setReviewsData] = useState([]);
const [isLoadingD, setLoadingD] = useState(true);
const { id,poster,title,realase,detail,rating } = route.params;
let itemId=id;
let posterPath=poster;
const [numberStar, setnStar] = useState('');


const [modalVisible, setModalVisible] = useState(false);
const [audioStatus, setAudioStatus] = useState(false);
const [flagAudio, setFlagAudio] = useState(false);

  const inCaseNoReviews = (result) => {
    if (result==0)
    {
      return <Text
        style={{ textAlign: 'left', flexWrap: 'wrap', margin: 10, color:'#ebf3f5' }}>
        Ugghh! No Reviews Found 😔
      </Text>
    }
  }

  const inCaseNoOverview = (result) => {
    if (result=='')
    {
      return <Text
        style={{ textAlign: 'left', flexWrap: 'wrap', margin: 10, color:'#ebf3f5' }}>
        Oops! We couldn't find an Overview 😔
      </Text>
    }
  }

   const insertImage = (poster, customStyle) => {

    if (poster!=null)
    {
      return <Image
                style={[styles.image, customStyle]}
                source={{ 
                  uri:
                    'https://image.tmdb.org/t/p/w185/' + poster,
                }}
              />
    }

    else{
      return <Image
                style={[styles.image, customStyle]}
                source={{ 
                  uri:
                    'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/red-(2016)-et00046748-21-09-2016-06-28-07.jpg'
                }}
              />
    }
  }
  async function alertIfSpeaking(description) {
                   let speaking = await Speech.isSpeakingAsync();
    if (speaking) {
      Speech.stop();
       setFlagAudio(true)

     } 
  else {
      Speech.speak(description);
      setFlagAudio(true);
    } }

const ref = React.useRef(0);

  useEffect(() => {
                      fetch(
                      'https://api.themoviedb.org/3/movie/'+id+'/reviews?api_key=fe73570f16e8e63b8a3e86436a277255'
                    
                    )
                      .then((response) => response.json())
                      .then((json) => setReviewsData(json))
                      .catch((error) => console.error(error))
                      .finally(() => setLoadingD(false));  },[audioStatus]);

  useEffect(() => {
                      fetch(
                      'https://api.themoviedb.org/3/movie/' +
                        itemId +
                        '/videos?api_key=fe73570f16e8e63b8a3e86436a277255'
                    
                    )
                      .then((response) => response.json())
                      .then((json) => setVideoData(json))
                      .catch((error) => console.error(error))
                      .finally(() => setLoadingD(false)) 
                      
      return ()=>{
            Speech && Speech.stop()
                       }                     },[audioStatus]);
  
    useEffect(() => {
                      fetch(
                      'https://api.themoviedb.org/3/movie/+'+itemId+'/similar?api_key=fe73570f16e8e63b8a3e86436a277255&language=en-US&page=1'
                    
                    )
                      .then((response) => response.json())
                      .then((json) => setSimilarData(json))
                      .catch((error) => console.error(error))
                      .finally(() => setLoadingD(false));  },[audioStatus]);

  return (
    <ScrollView ref={ref} style={styles.container}>
      {isLoadingD ? (
        <Text style={styles.header}>Loading...</Text>
      ) : (
        <View>
              <View>
                <Card style={{ margin: 5, backgroundColor:'#465461' }}>
                  
                  {insertImage(poster, { width: 200, height: 300 })}

                  <Text
                    style={{
                      marginBottom: 10,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      flexWrap: 'wrap',
                      marginLeft: 10,
                      marginRight: 10,
                      color:'#ebf3f5',
                    }}>
                    {title}
                  </Text>

                  <View style={{alignSelf:'center'}}>
                      <StarRating
                        rating={rating/2}
                        onChange={setnStar}
                        maxStars={5}	
                        color='yellow'	
                      />
                  </View>

                   <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.label}>Overview</Text>

                    <TouchableOpacity
                      onPress={() => {
                        alertIfSpeaking(detail);
                      }}>
                      <Image
                        style={styles.speakerIcon}
                        source={require('../assets/speaker.png')}
                      />
                    </TouchableOpacity>
                  </View>

                  {inCaseNoOverview(detail)}

                  <Text
                    style={{ textAlign: 'left', flexWrap: 'wrap', margin: 10, color:'#ebf3f5' }}>
                    {detail}
                  </Text>

                  <Text style={styles.label}>Reviews</Text>

                  {inCaseNoReviews(reviewsData.total_results)}

                    <FlatList
                          horizontal={true}
                          data={reviewsData.results}
                          keyExtractor={({ id }, index) => id}
                          renderItem={({ item }) => (
                            
                              <Card style={{ margin: 5, backgroundColor: '#272e38', 
                              flex:1 , width:275, height:250}}>

                                  <View style={{flexDirection:'column'}}>

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
                                        {item.author_details.name}
                                      </Text>

                                      <Text
                                        numberOfLines={10}
                                        style={{
                                          marginTop:5,
                                          marginLeft: 10,
                                          color:'#ebf3f5',
                                        }}>
                                        {item.content}
                                      </Text>

                                  </View>

                              </Card>
                          )}
                        />

                  <TouchableOpacity style={styles.button} onPress={() => {

                    setAudioStatus(!audioStatus);
                        const trailerNo = videoData.results.filter(function (item) {
                          return item.type == 'Trailer';
                        })
                        .map(function ({ key }) {
                          return { key };
                        });

                        if (trailerNo[0]!=null)
                        {
                          Linking.openURL(
                          'https://www.youtube.com/watch?v=' + trailerNo[0].key
                          );
                        }

                        else
                        {
                          <View>
                              
                            const simpleAlertHandler = () => {
                              Alert.alert('Apologies! 😔',
                              'We could not find a trailer for the selected movie 🎥'
                              )
                            };

                          </View>
                        }
                      
 }}>
                      <Text style={{color:'white', fontWeight:'bold', margin:3}}>Watch Trailer</Text>

                  </TouchableOpacity>
                </Card>
              </View>

              
              <View>
                <Text style={styles.similarTileHeader}>
                  Similar Titles
                </Text>
                      <FlatList
                    style={{marginBottom:50}}
                    data={similarData.results}
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => (

                      <TouchableOpacity
                              onPress={() => {
                              ref.current.scrollTo(0);
                              navigation.push('MovieScreen',{id:item.id,poster:item.poster_path, detail:item.overview, title:item.title, realse:item.release_date, rating:item.vote_average});
                                setAudioStatus(!audioStatus);  
  
                              }}>
                      
                        <Card style={{ margin: 5, backgroundColor: '#465461', padding:'1%'}}>

                          <View style={{flexDirection:'row'}}>
                             
                              {insertImage(item.poster_path)}

                            <View style={{flexDirection:'column', flex:1}}>

                                <Text
                                  style={{
                                    flexWrap:'wrap',
                                    marginTop:10,
                                    marginBottom: 10,
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                    marginLeft: 10,
                                    marginRight: 10,
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
                                    starSize={20}
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
                                    marginBottom:10,
                                    marginRight:10,
                                  }}>
                                  {item.overview}
                                </Text>

                    
                            </View>

                          </View>  

                        </Card>
                      </TouchableOpacity>
                      
                    )}
                  />

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
    padding: '3%',
    paddingTop: '2%',
  },
  image: {
    height: 150,
    width: 100,
    alignSelf: 'center',
    margin: 10,
  },
  similarImages: {
    height: 150,
    width: 100,
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
  button: {
    alignSelf:'center',
    alignItems: "center",
    backgroundColor: '#fe893a',
    margin:10,
    height:25,
    width:100,
    borderRadius:20,
  },
  navButtons: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#0f7abc',
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
    margin: 15,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'#fe893a'
  },

  similarTileHeader: {
    margin: 15,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    color:'#fe893a'
  },
});

export default MovieDetailedScreen;