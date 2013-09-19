gitlab-node-irc
===============

lightweight node.js irc bot that announces gitlab commit messages


Install
-------

```bash
git clone https://github.com/shm/gitlab-node-irc.git
cd gitlab-node-irc
mv config.sample.js config.js

// edit the configuration file
vim config.js

node server.js
```

Gitlab hook
-----------

Set you post commit web hook of your gitlab repository to
```bash
http://localhost:8080/commit?channel=<IRC_CHANNEL>
```
(IRC_CHANNEL without the leading #)

The irc bot will join the IRC_CHANNEL, announce the commits and leave the channel.


