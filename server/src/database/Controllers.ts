import "reflect-metadata";
import { getManager, EntityManager } from "typeorm";
import { Locations } from "./entity/Locations";
import { Posts} from "./entity/Posts";
const typeorm = require("typeorm"); // import * as typeorm from "typeorm";
const entityManager = getManager(); // you can also get it via getConnection().manager

// console.log(connection)
const createPost = (postValues:object, locationValues:object)=>{
  let post = new Posts();
  Object.assign(post, postValues)
  if(locationValues){
    let location = new Locations();
    Object.assign(location, locationValues);
    post.coordinate = location;
    return createLocationOrFindLocation(location)
      .then(loc => {
        post.coordinate = loc;
        return entityManager.save(Posts, post)
      })
      .catch()
  } else {
    return entityManager.save(Posts, post)
      .then(x=>{
        console.log('succesfully saved post')
        return x;
      })
      .catch(x => {
        console.log('error on making post');
      })
  }
}


const getPost = (postValues:object)=>{
  const post = new Posts();
  debugger;
  Object.assign(post, postValues)
  entityManager.findOne(Posts, post)
  .then((x)=>{
    // console.log('success')
  })
  .catch(x=>{console.log('error');})

}
const getAllPosts = ()=>{
  return entityManager.find(Posts, { relations: ["coordinate"] })
.then(allPosts=>console.log(allPosts))
.catch(x=>console.log(x))
}



const createLocationOrFindLocation = (locationValues:any)=>{
  const location = new Locations();
  Object.assign(location, locationValues)
  const entityManager = getManager(); // you can also get it via getConnection().manager
  return entityManager.findOne(Locations, location)
  .then((locationFound:any)=>{
    if(locationFound){
      return locationFound
    } else{
      return entityManager.save(Locations, location)
    }
  })
}

const getLocation = (locationValues:any)=>{
  const location = new Locations();
  Object.assign(location, locationValues);
  const entityManager = getManager();
  return entityManager.findOne(Locations, location)
  // .then(x=>console.log(x, "HEREEEEEEEEEE"))
}

setTimeout(()=>{

  const post = new Posts()
  post.title = "hmm"
  post.text = "hmm"
  post.post_public = false;
  post.post_local = false;
  post.time_expires = "da"
  post.post_anonymous = false;

  let location = new Locations();
  location.long = 'new'
  location.lat = 'haa'
  createPost(post, location)

  getPost({post: { long: 'new', lat: 'haa' },});
  let newLocation = new Locations();
  location.long
  getLocation(newLocation);
  getAllPosts();

  
}, 300);
