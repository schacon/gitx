var showNewFile = function(file)
{
	$('title').innerHTML = "New file: " + file.path;

	var contents = file.unstagedChanges();
	if (!contents) {
		notify("Can not display changes (Binary file?)", -1);
		return;
	}

	diff.innerHTML = contents.escapeHTML();
	diff.style.display = '';
}

var _file;
var _cached;
var _previousContext;

var showFileChanges = function(file, cached) {
	hideNotification();

	if (file.status == 0) // New file?
		return showNewFile(file);

	_file = file;
	_cached = cached;

	$("contextSize").oninput = function() {
		if ($("contextSize").value == _previousContext)
			return;
		_previousContext = $("contextSize").value;
		showDiff();
	};

	showDiff();
}

var showDiff = function()
{
	$("diff").style.display = 'none';
	var changes;
	if (_cached) {
		$("status").innerHTML = "Staged changes for " + _file.path;
		changes = _file._cachedChangesAmend_(Controller.amend());
	}
	else {
		$("status").innerHTML = "Unstaged changes for " + _file.path;
		changes = _file.unstagedChangesContext_($("contextSize").value);
	}

	if (changes == "") {
		notify("This _file has no more changes", 1);
		return;
	}


	displayDiff(changes, _cached);
	$("diff").style.display = '';
}

var diffHeader;
var originalDiff;

var displayDiff = function(diff, cached)
{
	diffHeader = diff.split("\n").slice(0,4).join("\n");
	originalDiff = diff;

	$("diff").innerHTML = diff.escapeHTML();
	highlightDiffs();
	hunkHeaders = $("diff").getElementsByClassName("hunkheader");

	for (i = 0; i < hunkHeaders.length; ++i) {
		var header = hunkHeaders[i];
		if (cached)
			header.innerHTML = "<a href='#' class='stagebutton' onclick='addHunk(this, true); return false'>Unstage</a>" + header.innerHTML;
		else
			header.innerHTML = "<a href='#' class='stagebutton' onclick='addHunk(this, false); return false'>Stage</a>" + header.innerHTML;
	}
}

var addHunk = function(hunk, reverse)
{
	hunkHeader = hunk.nextSibling.data.split("\n")[0];
	if (m = hunkHeader.match(/@@.*@@/))
		hunkHeader = m;

	start = originalDiff.indexOf(hunkHeader);
	end = originalDiff.indexOf("\n@@", start + 1);
	end2 = originalDiff.indexOf("\ndiff", start + 1);
	if (end2 < end && end2 > 0)
		end = end2;

	if (end == -1)
		end = originalDiff.length;

	hunkText = originalDiff.substring(start, end);
	hunkText = diffHeader + "\n" + hunkText + "\n";

	if (Controller.stageHunk_reverse_)
		Controller.stageHunk_reverse_(hunkText, reverse);
	else
		alert(hunkText);
}
