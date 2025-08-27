export interface GithubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name?: string; // Optional, as not all users have a name set
    company?: string; // Optional
    blog?: string; // Optional
    location?: string; // Optional
    email?: string; // Optional
    hireable?: boolean; // Optional
    bio?: string; // Optional
    twitter_username?: string; // Optional
    public_repos?: number; // Optional
    public_gists?: number; // Optional
    followers?: number; // Optional
    following?: number; // Optional
    created_at?: string; // Optional (ISO 8601 format)
    updated_at?: string; // Optional (ISO 8601 format)
}
