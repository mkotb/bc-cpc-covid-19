import { Typography, makeStyles, Divider, withStyles, Theme, createStyles, Container } from '@material-ui/core';
import React from 'react';
import ResourceTag from '../components/ResourceTag';
import Header from '../components/Header';
import { Styles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles/withStyles';
import { Resource, CriteriaType, Criteria, criteriaDataTable, CriteriaData } from '../interfaces';
import ResourceResults from '../components/ResourceResults';

const styles = (theme: Theme) => createStyles(({
    root: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column'
    },
    test: {
        display: 'flex',
        flexDirection: 'column'
    },
    captionBox: {
        display: 'flex',
        margin: theme.spacing(4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        alignSelf: 'center'
    },
    caption: {
        maxWidth: '30rem',
        fontSize: '16px',
        margin: theme.spacing(0, 0, 0, 6)
    },
    sourceTag: {
        fontSize: '12px',
        fontWeight: 300,
        textAlign: 'center',
        margin: theme.spacing(1)
    },
    covidImage: {
        maxHeight: '250px',
        objectFit: 'contain'
    }
}));

type IndexState = {
    criteria: Criteria
}

interface IndexProps extends WithStyles<typeof styles> {
}

class Index extends React.Component<IndexProps, IndexState> {
    constructor(props: IndexProps) {
        super(props);

        this.state = {
            criteria: {
                audience: '',
                topic: '',
                origin: '',
                resourceType: ''
            }
        };
    }

    async componentDidMount() {
        const request = await fetch('https://bc-cpc-covid.azurewebsites.net/criteria');
        const jsonResult = await request.json();

        Object.keys(jsonResult).forEach((key) => {
            criteriaDataTable[key as CriteriaType] = jsonResult[key] as CriteriaData;
        });
        
        this.forceUpdate();
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Header />

                <div className={classes.captionBox}>
                    <div className={classes.test}>
                        <img className={classes.covidImage} src="/covid/coronavirus.png" alt="Coronavirus" />
                        <Typography className={classes.sourceTag} variant="caption">
                            Public Health Image Library (#23312) <br />
                            Centers for Disease Control and Prevention
                        </Typography>
                    </div>
                    <Typography className={classes.caption} variant="caption">
                        Find palliative care and self-care resources developed or adapted to the context of COVID-19. <br /> <br />
                        The resources are collected from around the world and organized according to topic, type, and issue province/country. 
                    </Typography>
                </div>

                <Divider variant="middle" />

                <Container>
                    <ResourceResults onCriteriaChange={this.onSearchCriteriaChange.bind(this)}
                                     criteria={this.state.criteria} />
                </Container>

                <style global jsx>{`
                    body {
                        margin: 0px;
                        background-color: #f5f5f5;
                    }
                `}</style>
            </div>
        )
    }

    onSearchCriteriaChange(criteriaType: CriteriaType, event: React.ChangeEvent<{value: unknown}>) {
        const criteriaUpdate = this.state.criteria;

        criteriaUpdate[criteriaType] = event.target.value as string;

        this.setState({
            criteria: criteriaUpdate
        })
    }
}

export default withStyles(styles)(Index)