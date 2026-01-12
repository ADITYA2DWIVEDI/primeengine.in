
import { Octokit } from "octokit";

export async function createRepoAndPush(
    accessToken: string,
    repoName: string,
    files: { path: string; content: string }[]
) {
    const octokit = new Octokit({ auth: accessToken });

    // 1. Get User Info
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const owner = user.login;

    // 2. Create Repository
    let repo;
    try {
        const res = await octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            private: false, // Public by default for now
            auto_init: true, // Initialize with README
        });
        repo = res.data;
    } catch (error: any) {
        if (error.status === 422) {
            // Repo exists, get it
            const res = await octokit.rest.repos.get({ owner, repo: repoName });
            repo = res.data;
        } else {
            throw error;
        }
    }

    // 3. Get default branch commit (usually main)
    const { data: refData } = await octokit.rest.git.getRef({
        owner,
        repo: repoName,
        ref: `heads/${repo.default_branch}`,
    });
    const latestCommitSha = refData.object.sha;

    // 4. Create Blobs for each file
    const treeItems = await Promise.all(
        files.map(async (file) => {
            const { data: blob } = await octokit.rest.git.createBlob({
                owner,
                repo: repoName,
                content: file.content,
                encoding: "utf-8",
            });
            return {
                path: file.path,
                mode: "100644", // File mode
                type: "blob",
                sha: blob.sha,
            };
        })
    );

    // 5. Create Tree
    const { data: tree } = await octokit.rest.git.createTree({
        owner,
        repo: repoName,
        base_tree: latestCommitSha,
        // @ts-ignore
        tree: treeItems,
    });

    // 6. Create Commit
    const { data: newCommit } = await octokit.rest.git.createCommit({
        owner,
        repo: repoName,
        message: "Deploy from Prime Engine",
        tree: tree.sha,
        parents: [latestCommitSha],
    });

    // 7. Update Reference (Push)
    await octokit.rest.git.updateRef({
        owner,
        repo: repoName,
        ref: `heads/${repo.default_branch}`,
        sha: newCommit.sha,
    });

    return repo.html_url;
}
