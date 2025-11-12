import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TopicList from './components/TopicList';
import TopicEditor from './components/TopicEditor';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1>Real-Time Topics App</h1>
        <Switch>
          <Route path="/" exact component={TopicList} />
          <Route path="/edit/:id" component={TopicEditor} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;