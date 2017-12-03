import React from 'react'
import { Creatable } from 'react-select'
import 'react-select/dist/react-select.css'


let OPTIONS = [
  {
    "login": "free1",
    "id": 3414865,
    "avatar_url": "https://avatars3.githubusercontent.com/u/3414865?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/free1",
    "html_url": "https://github.com/free1",
    "followers_url": "https://api.github.com/users/free1/followers",
    "following_url": "https://api.github.com/users/free1/following{/other_user}",
    "gists_url": "https://api.github.com/users/free1/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/free1/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/free1/subscriptions",
    "organizations_url": "https://api.github.com/users/free1/orgs",
    "repos_url": "https://api.github.com/users/free1/repos",
    "events_url": "https://api.github.com/users/free1/events{/privacy}",
    "received_events_url": "https://api.github.com/users/free1/received_events",
    "type": "User",
    "site_admin": false,
    "score": 47.106747
  },
  {
    "login": "freeekanayaka",
    "id": 598445,
    "avatar_url": "https://avatars0.githubusercontent.com/u/598445?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/freeekanayaka",
    "html_url": "https://github.com/freeekanayaka",
    "followers_url": "https://api.github.com/users/freeekanayaka/followers",
    "following_url": "https://api.github.com/users/freeekanayaka/following{/other_user}",
    "gists_url": "https://api.github.com/users/freeekanayaka/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/freeekanayaka/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/freeekanayaka/subscriptions",
    "organizations_url": "https://api.github.com/users/freeekanayaka/orgs",
    "repos_url": "https://api.github.com/users/freeekanayaka/repos",
    "events_url": "https://api.github.com/users/freeekanayaka/events{/privacy}",
    "received_events_url": "https://api.github.com/users/freeekanayaka/received_events",
    "type": "User",
    "site_admin": false,
    "score": 38.39654
  },
  {
    "login": "csufuyi",
    "id": 1468456,
    "avatar_url": "https://avatars2.githubusercontent.com/u/1468456?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/csufuyi",
    "html_url": "https://github.com/csufuyi",
    "followers_url": "https://api.github.com/users/csufuyi/followers",
    "following_url": "https://api.github.com/users/csufuyi/following{/other_user}",
    "gists_url": "https://api.github.com/users/csufuyi/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/csufuyi/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/csufuyi/subscriptions",
    "organizations_url": "https://api.github.com/users/csufuyi/orgs",
    "repos_url": "https://api.github.com/users/csufuyi/repos",
    "events_url": "https://api.github.com/users/csufuyi/events{/privacy}",
    "received_events_url": "https://api.github.com/users/csufuyi/received_events",
    "type": "User",
    "site_admin": false,
    "score": 33.074898
  },
  {
    "login": "zhufree",
    "id": 6095752,
    "avatar_url": "https://avatars2.githubusercontent.com/u/6095752?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/zhufree",
    "html_url": "https://github.com/zhufree",
    "followers_url": "https://api.github.com/users/zhufree/followers",
    "following_url": "https://api.github.com/users/zhufree/following{/other_user}",
    "gists_url": "https://api.github.com/users/zhufree/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/zhufree/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/zhufree/subscriptions",
    "organizations_url": "https://api.github.com/users/zhufree/orgs",
    "repos_url": "https://api.github.com/users/zhufree/repos",
    "events_url": "https://api.github.com/users/zhufree/events{/privacy}",
    "received_events_url": "https://api.github.com/users/zhufree/received_events",
    "type": "User",
    "site_admin": false,
    "score": 31.141943
  },
  {
    "login": "free",
    "id": 32070098,
    "avatar_url": "https://avatars1.githubusercontent.com/u/32070098?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/free",
    "html_url": "https://github.com/free",
    "followers_url": "https://api.github.com/users/free/followers",
    "following_url": "https://api.github.com/users/free/following{/other_user}",
    "gists_url": "https://api.github.com/users/free/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/free/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/free/subscriptions",
    "organizations_url": "https://api.github.com/users/free/orgs",
    "repos_url": "https://api.github.com/users/free/repos",
    "events_url": "https://api.github.com/users/free/events{/privacy}",
    "received_events_url": "https://api.github.com/users/free/received_events",
    "type": "User",
    "site_admin": false,
    "score": 27.751638
  }
]

export class DomainFilter extends React.Component {
  constructor() {
    super()
    this.state = {
      enabled: true,
      value: []
    }
  }

  onChange(value) {
    this.setState({
      value: value
    });
  }

  gotoUser(value, event) {
    window.open(value.html_url);
  }

  toggleEnable() {
    this.setState({
      enabled: !this.state.enabled
    })
  }

  render() {
    return (
      <div className="section">
        <h3 className="section-heading">Filter out domains</h3>
        <Creatable
          multi
          value={this.state.value}
          onChange={this.onChange}
          onValueClick={this.gotoUser}
          valueKey="id"
          labelKey="login"
          options={OPTIONS}
          backspaceRemoves />
        <div className="checkbox-list">
          <label className="checkbox">
            <input type="checkbox" className="checkbox-control" checked={this.state.creatable} onChange={this.toggleEnable} />
            <span className="checkbox-label">Enable filtering</span>
          </label>
        </div>
        <div className="hint">Hide domains by entering them here</div>
      </div>
    );
  }

}
