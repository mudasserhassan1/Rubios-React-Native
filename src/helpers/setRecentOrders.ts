import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setRecentOrders(orderObj: any, basketid: string) {
  let recentorders = await AsyncStorage.getItem('recentorders');
  if (recentorders) {
    let recentordersList = JSON.parse(recentorders);
    const order = {
      orderid: orderObj.oloid,
      orderref: orderObj.orderref,
      basketid: basketid,
      date: moment(new Date()).format('DD/MM/YYYY'),
      isMarkFav: false,
    };
    recentordersList.push(order);
    await AsyncStorage.setItem('recentorders', JSON.stringify(recentordersList));
  } else {
    const items = [
      {
        orderid: orderObj.oloid,
        orderref: orderObj.orderref,
        basketid: basketid,
        date: moment(new Date()).format('DD/MM/YYYY'),
        isMarkFav: false,
      },
    ];
    await AsyncStorage.setItem('recentorders', JSON.stringify(items));
  }
}

export async function markOrderFav(
  basketId: string,
  favId: number,
  mark: boolean,
) {
  let recentorders = await AsyncStorage.getItem('recentorders');
  if (recentorders) {
    let recentordersList = JSON.parse(recentorders);
    let order;
    if (basketId !== '') {
      order = recentordersList.find((x: any) => x.basketid === basketId);
    } else {
      order = recentordersList.find((x: any) => x.favId === favId);
    }
    if (order) {
      order.isMarkFav = mark;
      order.favId = favId;
      await AsyncStorage.setItem('recentorders', JSON.stringify(recentordersList));
    }
  }
}

export async function updateLocalRecentOrdersList() {
  let recentorders = await AsyncStorage.getItem('recentorders');
  var d = new Date();
  d.setDate(d.getDate() - 5);
  if (recentorders) {
    let recentordersList = JSON.parse(recentorders);
    let newList: any[] = [];
    recentordersList.map((x: any) => {
      if (x.date !== moment(d).format('DD/MM/YYYY')) {
        newList.push(x);
      }
    });
    await AsyncStorage.setItem('recentorders', JSON.stringify(newList));
  }
}
