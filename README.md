# text2playlist
I want to make a playlist from text file for modern jive!
This script reads playlist typed in textarea and make it into your youtube playlist.
When you have hundreds of titles and want them into the playlist, this script will help it.

you need your web server, google account and some experience about www.


preparation:

1. download source codes from github https://github.com/konbuerimaki/text2playlist.
2. upload that files to your www any directory.
3. test to open that page.

google account:

4. open google developer console. https://console.developers.google.com/
5. create OAuth2.0 client ID in API Manager. in the OAuth page, choose "web application".
6. IMPORTANT! specify your web server URL in "authorized JavaScript origins".
7. You do not have to specify "authorized redirect URIs".
8. Copy client id and paste it client id textbox.

youtube:

9. Then, open a youtube with logged in your google id.
10. In youtube, create a youtube playlist.
11. Copy the playlist id(you can find it in a playlist url) and paste that id to the playlist id textbox.

now it shuold work.


1. Load playlist text

it reads titles in textarea. one line, one search text string.

2. search titles in youtube

it searchs titles in youtube. this result is used for making a playlist.

3. check song's view count

you can check view count. copy and paste this result in spreadsheet and filter top ranking.

4. Add a song to youtube playlist

to click this button, it adds search result in the youtube playlist which you created.
