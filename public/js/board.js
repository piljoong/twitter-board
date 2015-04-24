
var RELOAD_INTERVAL = 1000;
var _oldTotal = 0;

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
    var newTotal = Object.keys(content).length;
    var diff = newTotal - _oldTotal;
    var totalText = 'total: ' + newTotal;
    totalText = (diff != 0) ? totalText + ' [' + diff + ' added]' : totalText;
    $('#total').html(totalText);

    _oldTotal = newTotal;

    if (diff == 0) {
        return;
    }
    

    $('#list').empty();
    sorted_content = sort_content(content);
    for (var idx in sorted_content) {
        var user = sorted_content[idx];
        var item = '<li>'
            + '<img src="' + user.profile + '"> '
            + user.name
            + ' <font color="red">[' + user.count + ']</font>'
            + '</li>';
        $('#list').append(item);
    }
}


function statusUpdate(msg) {
    $('#status').html(msg);
}

function reload() {
    setTimeout(reload, RELOAD_INTERVAL);
    $.get('/update', function(res) {
        var err = res.error|| null;
        if (err != null) {
            statusUpdate('Failed to fetch');
        } else {
            updatePage(res.content);
        }
    });
}

reload();
