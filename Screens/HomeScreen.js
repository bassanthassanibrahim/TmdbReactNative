import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Picker, 
ScrollView,Alert, FlatList, Animated} from 'react-native';
import Constants from 'expo-constants';
import { Card, Searchbar } from 'react-native-paper';
import StarRating from 'react-native-star-rating-widget';

const HomeScreen = ({navigation}) => {

  const [searchQuery, setSearchQuery] = React.useState(null);
  const onChangeSearch = query => setSearchQuery(query);

  const onSearchPress = () => {
     if (searchQuery==null || searchQuery==''  )
    {
      alert("Please enter a movie title")
    }
else 
    navigation.navigate('DisplayScreen',{title:searchQuery})
  };


    const onFilterPress = () => {
      if (selectedGenre!=null)
      {
        navigation.navigate('FilterScreen',{genre:selectedGenre})
      }
      else{
        alert("Please select a genre")
      }
  };

  const onPress = () => console.log('Button Clicked');
  const [selectedGenre, setSelectedGenre] = useState();
  const [selectedGenreName, setSelectedGenreName] = useState();
 const [navigtedGenre, setNavigatedGenre] = React.useState(null);
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
 const [upcomingData, setUpcomingData] = useState([]);
 const [isLoading, setLoading] = useState(true);
 const [numberStar, setnStar]=useState('');

 useEffect(() => {
    fetch(
      'https://api.themoviedb.org/3/movie/now_playing?api_key=fe73570f16e8e63b8a3e86436a277255&language=en-US&page=1&region='+selectedRegion
    )
      .then((response) => response.json())
      .then((json) => setNowPlayingData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [selectedRegion]);

  useEffect(() => {
    fetch(
      'https://api.themoviedb.org/3/movie/upcoming?api_key=fe73570f16e8e63b8a3e86436a277255&region='+selectedRegion2
    )
      .then((response) => response.json())
      .then((json) => setUpcomingData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [selectedRegion2]);


  return (
    <ScrollView>
    <View style={styles.container}>

    <Text style={styles.header}>
      Welcome to TMDB {'\n'}
       Your Personal Movie Database
      </Text>

      <Image style={styles.logo} source={require('../assets/filmRoll.png')} />


      <Text style={styles.tagLine}>
         Join us and take a deeper dive {'\n'}into the movies you love ❤️️ ️️ ️️
      </Text>

      <Card style={{marginLeft:5,marginRight:5, backgroundColor:'#465461', marginBottom:30,padding:'2%'}}>
        <Text style={styles.label}>
          Search by Title
        </Text>

        <Searchbar
          style={{margin:10, backgroundColor:'#c4dbe0'}}
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          onIconPress = {onSearchPress}
          onSubmitEditing={onSearchPress}
        />

        <TouchableOpacity style={[styles.button, { alignSelf:'flex-end', borderRadius:10}]}onPress={onSearchPress}>
          <Text style={{color:'white', fontWeight:'bold', margin:3}}>Search</Text>
        </TouchableOpacity>

      </Card>

      <Text style={styles.normalText}>
          Now Playing
      </Text>

      <View style={{ borderRadius: 4, margin:10}}>
        <Picker
          style={{ fontSize: 16,
          height:40,
          width:200,
          borderRadius:5,
           color: 'black',
           backgroundColor:'#c4dbe0',
           textAlign: 'center',
           fontWeight: 'bold' }}
          selectedValue={selectedRegion}
          onValueChange={(itemValue, itemIndex) =>
          setSelectedRegion(itemValue)
          }
>
          <Picker.Item label="United States" value='US' />
          <Picker.Item label="United Kingdom" value='GB' />
          <Picker.Item label="Pakistan" value='PK' />
          <Picker.Item label="India" value='IN' />
          <Picker.Item label="Germany" value='DE' />
          <Picker.Item label="Japan" value='JP' />
          <Picker.Item label="Australia" value='AU' />
        </Picker>
        </View>
      
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

      <Card style={{marginLeft:5,marginRight:5, backgroundColor:'#465461', marginBottom:30,padding:'2%'}}>

      <Text style={styles.label}>
          Browse By Genre
        </Text>

        <View style={{borderRadius: 4, margin:10, alignItems:'center'}}>
        <Picker
          style={{ fontSize: 16,
          height:40,
          width:500,
          borderRadius:5,
           color: '#272e38',
           backgroundColor:'#c4dbe0',
           textAlign: 'center',
           fontWeight: 'bold' }}
          selectedValue={selectedGenre}
          onValueChange={
            (itemValue, itemIndex) => setSelectedGenre(itemValue) 
          }
        >
          
          <Picker.Item label="Select Genre" value='null' />
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
        
        <View>
          <TouchableOpacity style={styles.button} onPress={onFilterPress}>
                  <Text style={{color:'white', fontWeight:'bold', margin:3}}>Filter</Text>
                </TouchableOpacity>
        </View>


      </Card>

        <Text style={styles.normalText}>
          Upcoming Titles
        </Text>

        <View style={{borderRadius: 4, margin:10}}>
        <Picker
          style={{ fontSize: 16,
          height:40,
          width:200,
          borderRadius:5,
           color: 'black',
           backgroundColor:'#c4dbe0',
           textAlign: 'center',
           fontWeight: 'bold' }}
          selectedValue={selectedRegion2}
          onValueChange={(itemValue, itemIndex) =>
          setSelectedRegion2(itemValue)
          }
>
          <Picker.Item label="India" value='IN' />
          <Picker.Item label="United States" value='US' />
          <Picker.Item label="United Kingdom" value='GB' />
          <Picker.Item label="Pakistan" value='PK' />
          <Picker.Item label="Germany" value='DE' />
          <Picker.Item label="Japan" value='JP' />
          <Picker.Item label="Australia" value='AU' />
        </Picker>
        </View>

        <ScrollView>

      <FlatList
            horizontal={true}
            data={upcomingData.results}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (

              <TouchableOpacity
                      onPress={() => {
                      navigation.navigate('MovieScreen',{id:item.id,poster:item.poster_path, detail:item.overview, title:item.title, realse:item.release_date, rating:item.vote_average});  
                      }}>
              
                <Card style={{ margin: 5, backgroundColor: '#465461' }}>

                  <View>

                  {insertImage(item.poster_path)}

                    <View style={{flexDirection:'column', flex:1}}>

                        <Text
                          style={{
                            marginTop:10,
                            marginBottom: 10,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginLeft: 10,
                            marginRight: 10,
                            flexWrap:'wrap',
                            color:'#ebf3f5',
                          }}
                          adjustsFontSizeToFit={true}
                          >
                          {item.original_title}
                        </Text>

                        <Text
                          style={{
                            marginTop:10,
                            marginBottom: 10,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginLeft: 10,
                            marginRight: 10,
                            flexWrap:'wrap',
                            color:'#ebf3f5',
                          }}
                          adjustsFontSizeToFit={true}
                          >
                          Release Date: {item.release_date}
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
    padding: '7.5%',
    paddingBottom:15,
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
    height: 250,
    width: 166.65,
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
