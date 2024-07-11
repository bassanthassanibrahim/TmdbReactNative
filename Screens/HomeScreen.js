import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Picker, 
ScrollView,Alert, FlatList, Animated} from 'react-native';
import Constants from 'expo-constants';
import { Card, Searchbar } from 'react-native-paper';
import StarRating from 'react-native-star-rating-widget';

const HomeScreen = ({navigation}) => {


 const [selectedRegion, setSelectedRegion] = React.useState('US');
 const [selectedRegion2, setSelectedRegion2] = React.useState('US');

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

 const [nowPlayingData, setNowPlayingData] = useState([]);
 const [isLoading, setLoading] = useState(true);
 const [numberStar, setnStar]=useState('');

 useEffect(() => {
    fetch(
      'https://api.themoviedb.org/3/movie/popular?api_key=fe73570f16e8e63b8a3e86436a277255&page=1'
    )
      .then((response) => response.json())
      .then((json) => setNowPlayingData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  });



  return (
    <ScrollView>
    <View style={styles.container}>

    <Text style={styles.header}>
      Welcome to TMDB {'\n'}
       Your Personal Movie Database
      </Text>

      <Image style={styles.logo} source={require('../assets/filmRoll.png')} />


      <Text style={styles.tagLine}>
         Join us and take a deeper dive {'\n'}into the movies you love  
      </Text>


      <Text style={styles.normalText}>
          Popular Movies
      </Text>

      
      <ScrollView style={{marginBottom:25}}>

      <FlatList
            horizontal={true}
            data={nowPlayingData.results}
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

                    </View>

                  </View>  

                </Card>
              </TouchableOpacity>
              
            )}
          />

        </ScrollView>

    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#282f39',
    padding: '3%',
    paddingBottom:70,
  },
  header: {
    marginTop:20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'#fe893a'
  },
  normalText: {
    marginLeft:10,
    marginRight:10,
    marginBottom:5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    color:'#ebf3f5',
  },
  tagLine: {
    marginLeft:10,
    marginRight:10,
    marginBottom:15,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'#ebf3f5',
  },
   input: {
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    marginBottom:10,
    marginTop:4,
    borderWidth: 1,
    padding: 10,
    borderRadius:5,
    color:'#ebf3f5',
  },
  label: {
    marginTop:10,
    marginLeft:10,
    fontWeight: 'bold',
    textAlign: 'left',
    color:'#ebf3f5'
  },
  logo: {
    height: 250,
    width: 250,
    alignSelf:'center',
    margin:15,
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
  categoryButton: {
    alignSelf:'center',
    alignItems: "center",
    backgroundColor: '#fe893a',
    margin:5,
    height:25,
    width:70,
    borderRadius:20,
  },
  image: {
    height: 200,
    width: 133.32,
    alignSelf: 'center',
    margin: 10,
  },


  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },

});

export default HomeScreen;
