/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';
import Container from '../../components/Container';
// eslint-disable-next-line import/named
import { Loading, Owner, IssueList } from './styles';

export default class Repository extends Component {
    // eslint-disable-next-line react/static-property-placement
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                respository: PropTypes.string,
            }),
        }).isRequired,
    };

    // eslint-disable-next-line react/state-in-constructor
    state = {
        // eslint-disable-next-line react/no-unused-state
        repository: {},
        // eslint-disable-next-line react/no-unused-state
        issues: [],
        // eslint-disable-next-line react/no-unused-state
        loading: true,
    };

    async componentDidMount() {
        // eslint-disable-next-line react/prop-types
        const { match } = this.props;

        // eslint-disable-next-line react/prop-types
        const repoName = decodeURIComponent(match.params.repository);

        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                params: {
                    state: 'open',
                    per_page: 5,
                },
            }),
        ]);

        this.setState({
            // eslint-disable-next-line react/no-unused-state
            repository: repository.data,
            // eslint-disable-next-line react/no-unused-state
            issues: issues.data,
            // eslint-disable-next-line react/no-unused-state
            loading: false,
        });
    }

    render() {
        const { repository, issues, loading } = this.state;

        if (loading) {
            return <Loading>Carregando</Loading>;
        }

        return (
            <Container>
                <Owner>
                    <Link to="/">Voltar aos repositórios</Link>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />
                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>

                <IssueList>
                    {issues.map(issue => (
                        <li key={String(issue.id)}>
                            <img
                                src={issue.user.avatar_url}
                                alt={issue.user.login}
                            />

                            <div>
                                <strong>
                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                    <a href={issue.html_url}>{issue.title}></a>
                                    {issue.labels.map(label => (
                                        <span key={String(label.id)}>
                                            {label.name}
                                        </span>
                                    ))}
                                </strong>
                                <p>{issue.user.login}</p>
                            </div>
                        </li>
                    ))}
                </IssueList>
            </Container>
        );
    }
}