import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NorthStarThemeProvider from 'aws-northstar/components/NorthStarThemeProvider';
import AppLayout from './components/AppLayout';
import Users from './components/Users';

import Roles from './components/Roles';
import EditRole from './components/Roles/EditRole';

import DGaC from './components/DGaC';
import EditDGaC from './components/DGaC/EditDGaC';

import OntologyAttributes from './components/OntologyAttributes';
import EditOntologyAttributes from './components/OntologyAttributes/EditOntologyAttributes';

import DataDomains from './components/DataDomains';
import Dashboard from './components/Dashboard';

import Query from './components/Query';


const withLayout = (Component) => (props) => (
    <AppLayout>
        <Component {...props} />
    </AppLayout>
);

const App = () => {
    return (
        <NorthStarThemeProvider>
            <Router>
                <Switch>
                    <Route exact path="/dataDomains" component={withLayout(DataDomains)}></Route>
                    <Route exact path="/users" component={withLayout(Users)}></Route>
                    <Route exact path="/" component={withLayout(Dashboard)}></Route>
                    <Route exact path="/roles" component={withLayout(Roles)}></Route>
                    <Route exact path="/roles/edit/:roleId" component={withLayout(EditRole)}></Route>
                    <Route exact path="/dgac" component={withLayout(DGaC)}></Route>
                    <Route exact path="/dgac/edit/:dgacId" component={withLayout(EditDGaC)}></Route>
                    <Route exact path="/ontologyAttributes" component={withLayout(OntologyAttributes)}></Route>
                    <Route exact path="/ontologyAttributes/edit/:ontologyAttributeId" component={withLayout(EditOntologyAttributes)}></Route>
                    <Route exact path="/query" component={withLayout(Query)}></Route>

                </Switch>
            </Router>
        </NorthStarThemeProvider>
    );
};

export default App;
