import {reactotronEnhancer, sagaMonitor} from '../configs';
import {applyMiddleware, compose, createStore} from 'redux';
import {persistStore} from 'redux-persist';
import persistReducers from './reducers';
import rootSaga from './sagas';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware({sagaMonitor});

const enhancer = compose(applyMiddleware(sagaMiddleware), reactotronEnhancer);

export const store = createStore(persistReducers, enhancer);

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
