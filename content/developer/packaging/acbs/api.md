+++
title = "ACBS - API Reference"
+++

ACBS API Reference
==================

ACBS base
---------

ACBS base contains basic data structures.

class acbs.base.ACBSSourceInfo(type: str, url: str, revision=None,
branch=None, depth=None)

class acbs.base.ACBSPackageInfo(name: str, deps: List\[str\], location:
str, source\_uri: List\[acbs.base.ACBSSourceInfo\])

ACBS deps
---------

ACBS deps contains the dependency resolver.

acbs.deps.tarjan\_search(packages: OrderedDict\[str, ACBSPackageInfo\],
search\_path: str) -&gt; List\[List\[acbs.base.ACBSPackageInfo\]\]

> This function describes a Tarjan’s strongly connected components
> algorithm. The resulting list of ACBSPackageInfo are sorted
> topologically as a byproduct of the algorithm

ACBS utils
----------

ACBS utils contains some helper functions to perform some tasks easier.

class acbs.utils.ACBSLogFormatter(fmt=None, datefmt=None, style='%',
validate=True)

> ABBS-like format logger formatter class
>
> format(record)
>
> > Format the specified record as text.
> >
> > The record’s attribute dictionary is used as the operand to a string
> > formatting operation which yields the returned string. Before
> > formatting the dictionary, a couple of preparatory steps are carried
> > out. The message attribute of the record is computed using
> > LogRecord.getMessage(). If the formatting string uses the time (as
> > determined by a call to usesTime(), formatTime() is called to format
> > the event time. If there is exception information, it is formatted
> > using formatException() and appended to the message.

acbs.utils.full\_line\_banner(msg: str, char='-') -&gt; str

> Print a full line banner with customizable texts
>
> Parameters:  
> -   **msg** – message you want to be printed
> -   **char** – character to use to fill the banner

acbs.utils.get\_arch\_name() -&gt; Optional\[str\]

> Detect architecture of the host machine
>
> Returns:  
> architecture name

acbs.utils.guess\_extension\_name(filename: str) -&gt; str

> Guess extension name based on filename
>
> Parameters:  
> **filename** – name of the file
>
> Returns:  
> possible extension name

acbs.utils.human\_time(full\_seconds: float) -&gt; str

> Convert time span (in seconds) to more friendly format :param seconds:
> Time span in seconds (decimal is acceptable)

acbs.utils.print\_package\_names(packages:
List\[acbs.base.ACBSPackageInfo\], limit: Optional\[int\] = None) -&gt;
str

> Print out the names of packages
>
> Parameters:  
> -   **packages** – list of ACBSPackageInfo objects
> -   **limit** – maximum number of packages to print
>
> Returns:  
> a string containing the names of the packages
