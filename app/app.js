/* ---- DON'T EDIT BELOW ---- */

// init Medium editor
// var editor = new MediumEditor('.editor-body', {
//     toolbar: {
//         /* These are the default options for the toolbar,
//            if nothing is passed this is what is used */
//         allowMultiParagraphSelection: true,
//         buttons: ['bold', 'italic', 'underline', 'anchor', 'image', 'h2', 'h3', 'quote'],
//         diffLeft: 0,
//         diffTop: 0,
//         firstButtonClass: 'medium-editor-button-first',
//         lastButtonClass: 'medium-editor-button-last',
//         standardizeSelectionStart: false,
//         static: false,
//         relativeContainer: null,
//         /* options which only apply when static is true */
//         align: 'center',
//         sticky: false,
//         updateOnEmptySelection: false
//     },
//     placeholder: {
//         text: 'Click to edit'
//     },
//     autoLink: true
// });

var editor = new Editor({
  element: document.querySelector('.editor-body'),
  status: false,
  toolbar: [
      {name: 'bold', action: Editor.toggleBold},
      {name: 'italic', action: Editor.toggleItalic},
      {name: 'code', action: Editor.toggleCodeBlock},
      '|',

      {name: 'quote', action: Editor.toggleBlockquote},
      {name: 'unordered-list', action: Editor.toggleUnOrderedList},
      {name: 'ordered-list', action: Editor.toggleOrderedList},
      '|',

      {name: 'link', action: Editor.drawLink},
      {name: 'image', action: Editor.drawImage},
      '|',

      // {name: 'info', action: 'http://lab.lepture.com/editor/markdown'},
      {name: 'preview', action: Editor.togglePreview},
      {name: 'fullscreen', action: Editor.toggleFullScreen}
    ]
});
// load the markdown parse function
var parse = editor.constructor.markdown;
// sanitize value from form
var getBodyValue = function() {
    var val = editor.codemirror.getValue();
    return val.replace('"', '\"');
};
var setBodyValue = function(val) {
    if (val && val.length > 0) {
        editor.codemirror.getDoc().setValue(val);
    }
}

// Get params from the URL
var queryVals = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));


var defaults = {
        title: "/dev/solid",
        tagline: "Rocking the Solid Web",
        picture: "https://deiu.me/avatar.jpg",
        owner: "Andrei Sambra",
        webid: "https://deiu.me/profile#me",
        avatar: "https://deiu.me/avatar.jpg"
};

var init = function() {
    document.querySelector('.blog-picture').src = defaults.picture;
    document.querySelector('.blog-title').innerHTML = defaults.title;
    document.querySelector('.blog-tagline').innerHTML = defaults.tagline;

    // select element holding all the posts
    var postsdiv = document.querySelector('.posts');

    if (queryVals['view'] && queryVals['view'].length > 0) {
        var url = decodeURIComponent(queryVals['view']);
        var article = addPost(posts[url]);
        postsdiv.appendChild(article);
        var back = document.createElement('div');
        back.classList.add("inline-block");
        back.innerHTML = '<a class="dark underline" href="" onclick="goBack()">≪ Go back</a>';
        postsdiv.appendChild(back);
        var edit = document.createElement('div');
        edit.classList.add("inline-block");
        edit.innerHTML = '&nbsp;| <a class="dark underline" href="?edit='+encodeURIComponent(url)+'">Edit</a>';
        postsdiv.appendChild(edit);
    } else if (queryVals['edit'] && queryVals['edit'].length > 0) {
        var url = decodeURIComponent(queryVals['edit']);
        showEditor(url);
    } else if (queryVals['new'] !== undefined) {
        showEditor();
    } else {
        // add all posts to viewer
        for (var i in posts) {
            var article = addPost(posts[i]);
            postsdiv.appendChild(article);
        }
    }

    var header = document.querySelector('.header');
    var header_height = getComputedStyle(header).height.split('px')[0];
    var nav = document.querySelector('.nav');
    var pic = document.querySelector('.blog-picture');
    var pic_height = getComputedStyle(pic).height.split('px')[0];
    var diff = header_height - pic_height;

    function stickyScroll(e) {
        if (window.pageYOffset > (diff + 50)) {
            nav.classList.add('fixed-nav');
        }

        if(window.pageYOffset < (diff + 50)) {
            nav.classList.remove('fixed-nav');
        }
    }

    // Scroll handler to toggle classes.
    window.addEventListener('scroll', stickyScroll, false);
};

function goBack() {
    window.history.back();
}

var showEditor = function(url) {
    document.querySelector('.nav').classList.add('hidden');
    document.querySelector('.posts').classList.add('hidden');
    document.querySelector('.editor').classList.remove('hidden');
    if (url && url.length > 0) {
        var post = posts[url];
        if (post.title) {
            document.querySelector('.editor-title').innerHTML = post.title;
        }
        if (post.author) {
            var author = getAuthorByWebID(post.author);
            document.querySelector('.editor-author').innerHTML = author.name;
        }
        if (post.date) {
            document.querySelector('.editor-date').innerHTML = post.date;
        }
        if (post.body) {
            setBodyValue(post.body);
        }
    } else {
        document.querySelector('.editor-title').focus();
        document.querySelector('.editor-author').innerHTML = defaults.owner;
        document.querySelector('.editor-date').innerHTML = moment().format('LL');
    }
};

var cancelPublish = function() {
    document.querySelector('.nav').classList.remove('hidden');
    document.querySelector('.editor').classList.add('hidden');
    document.querySelector('.posts').classList.remove('hidden');
    document.querySelector('.editor-title').innerHTML = '';
    document.querySelector('.editor-author').innerHTML = '';
    document.querySelector('.editor-date').innerHTML = '';
    document.querySelector('.editor-body').innerHTML = '';
    goBack();
};

var publish = function() {
    console.log(getBodyValue());
};

var posts = {
    "https://example.org/post1": {
        url: "https://example.org/post1",
        title: "Introducing Solid",
        author: "https://deiu.me/profile#me",
        date: "4 Dec 2015",
        body: "![test](https://deiu.me/avatar.jpg) \n\n ```\nvar publish = function() {\n  console.log(bodyValue()); \n};\n``` \n ",
        tags: [
            { color: "#5aba59", name: "JS" },
            { color: "#4d85d1", name: "Solid" }
        ]
    },
    "https://example.org/post2": {
        url: "https://example.org/post2",
        title: "Everything You Need to Know About Solid",
        author: "https://deiu.me/profile#me",
        date: "3 Dec 2015",
        body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        tags: [
            { color: "#df2d4f", name: "Linked Data" },
            { color: "#4d85d1", name: "Solid" }
        ]
    },
    "https://example.org/post3": {
        url: "https://example.org/post3",
        title: "Photos from CSSConf and JSConf",
        author: "https://deiu.me/profile#me",
        date: "1 Dec 2015",
        body: '<img src="https://deiu.me/Public/stata-background.png">',
        tags: [

        ]
    },
    "https://example.org/post4": {
        url: "https://example.org/post4",
        title: "Rdflib.js 0.9 Released",
        author: "https://user/profile#me",
        date: "24 Nov 2015",
        body: "We are happy to announce the release of Rdflib.js 0.9! You can find it now on github, download it directly, or pull it in via npm. We’ve also updated the Solid spec with the latest documentation.",
        tags: [
            { color: "#8156a7", name: "Other" }
        ]
    }
};

var authors = {
    "https://deiu.me/profile#me": {
        name: "Andrei Sambra",
        picture: "https://deiu.me/avatar.jpg"
    },
    "https://user/profile#me": {}
};

var getAuthorByWebID = function(webid) {
    var name = '';
    var picture = 'favicon.png';
    if (webid && webid.length > 0) {
        var author = authors[webid];
        if (author && author.name) {
            name = author.name;
        }
        if (author && author.picture) {
            picture = author.picture;
        }
    }
    return {name: name, picture: picture};
};

var addPost = function(post) {
    // change separator: <h1 class="content-subhead">Recent Posts</h1>
    var author = getAuthorByWebID(post.author);
    var name = author.name;
    var picture = author.picture;

    // create main post element
    var article = document.createElement('article');
    article.classList.add('post');
    article.id = post.url;

    // create header
    var header = document.createElement('header');
    header.classList.add('post-header');
    // append header to article
    article.appendChild(header);

    // set avatar
    var avatar = document.createElement('img');
    avatar.classList.add('post-avatar');
    avatar.src = picture;
    avatar.alt = name+"&#x27;s avatar";
    // append picture to header
    header.appendChild(avatar);

    // create title
    var title = document.createElement('h2');
    title.classList.add('post-title');
    title.innerHTML = (post.title)?'<a href="?view='+encodeURIComponent(post.url)+'">'+post.title+'</a>':'';
    // append title to header
    header.appendChild(title);

    // add meta data
    var meta = document.createElement('p');
    meta.classList.add('post-meta');
    meta.innerHTML = "By ";
    // append meta to header
    header.appendChild(meta);

    // create meta author
    var metaAuthor = document.createElement('a');
    metaAuthor.classList.add('post-author');
    metaAuthor.href = post.author;
    metaAuthor.innerHTML = (name)?name:"Anonymous";
    // append meta author to meta
    meta.appendChild(metaAuthor);

    // create meta date
    var metaDate = document.createElement('span');
    metaDate.classList.add('post-date');
    metaDate.innerHTML = " on "+post.date;
    // append meta date to meta
    meta.appendChild(metaDate);

    // create meta tags
    var metaTags = document.createElement('span');
    metaTags.classList.add('post-tags');
    metaTags.innerHTML = " under ";
    if (post.tags && post.tags.length > 0) {
        for (var i in post.tags) {
            var tag = post.tags[i];
            if (tag.name && tag.name.length > 0) {
                var tagLink = document.createElement('a');
                tagLink.classList.add('post-category');
                if (tag.color) {
                    tagLink.setAttribute('style', 'background:'+tag.color+';');
                }
                tagLink.innerHTML = tag.name;
                tagLink.href = "#";
                tagLink.setAttribute('onclick', 'sortTag("'+tag.name+'")');
                metaTags.appendChild(tagLink);
            }
        }
    } else {
        var tagLink = document.createElement('a');
        tagLink.classList.add('post-category');
        tagLink.innerHTML = "Uncategorized";
        tagLink.href = "#";
        tagLink.setAttribute('onclick', 'sortTag("Uncategorized")');
        metaTags.appendChild(tagLink);
    }
    // append meta tag
    meta.appendChild(metaTags);

    // create body
    var body = document.createElement('section');
    body.classList.add('post-body');
    body.innerHTML = parse(post.body);
    // append body to article
    article.appendChild(body);

    // append article to list of posts
    return article;
};

var sortTag = function(name) {
    console.log(name);
};

// start app
init();