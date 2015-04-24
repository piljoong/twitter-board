
var RELOAD_INTERVAL = 1000;
var oldTotal = 0;

function sort_content(content) {
    var sorted = [];
    var tuples = [];

    for (var key in content) tuples.push([key, content[key]]);

    tuples.sort(function(a, b) {
        a = a[1];
        b = b[1];
        return a.count > b.count ? -1 : (a.count < b.count ? 1 : 0);
    });

    for (var i = 0; i < tuples.length; i++) {
        var key = tuples[i][0];
        var value = tuples[i][1];
        
        sorted.push(value);
    }
    return sorted;
}

function updatePage(content) {
    $('#list').empty();
    sorted_content = sort_content(content);
    for (var idx in sorted_content) {
        var user = sorted_content[idx];
        var item = '<li>' + user.name
            + ' <font color="red">[' + user.count + ']</font>'
            + '</li>';
        $('#list').append(item);
    }
    var newTotal = sorted_content.length;
    var diff = newTotal - oldTotal;
    var totalText = 'total: ' + newTotal;
    oldTotal = newTotal;
    totalText = (diff != 0) ? totalText + ' [' + diff + ' new]' : totalText;
    $('#total').html(totalText);
}

function reload() {
    setTimeout(reload, RELOAD_INTERVAL);
    $.get('/update', function(res) {
        updatePage(res.content);
    });
}

reload();
