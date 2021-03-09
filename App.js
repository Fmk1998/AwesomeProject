import React from 'react';
import {View, Text, StyleSheet,FlatList} from 'react-native';
import Header from './js/components/Header';
import ListItem from './js/components/ListItem';
import AddItem from "./js/components/Additem";
import UUID from "./js/utils/uuid";


const App = () => {
    const [items, setItems] = React.useState([{id: 1, text: 'react'}, {id: 2, text: 'vue'}, {id: 3, text: 'jquery'},
    ]);

     /**
       * 付民康  2021/3/8
       * desc: 点击删除事件
       * @params
       **/
     const deleteItem = (id) => {
         setItems((pre)=>{
             return pre.filter((item)=> {
                 return item.id !== id
             })
         })
     }

      /**
        * 付民康  2021/3/8
        * desc: 点击添加事件
        * @params
        **/
      const addItem = (text) => {
          if (text) {
              setItems((pre)=>{
                  return [...pre,{text:text,id:UUID()}]
              })
          }
      }

    return (
        <View style={styles.container}>
            <Header title={'我的应用'}/>
            <AddItem addItem={addItem}/>
            <FlatList data={items} renderItem={({item})=><ListItem deleteItem={deleteItem} item={item}/>}/>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
