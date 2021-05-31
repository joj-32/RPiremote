# RPiremote

LIRC statless application useful for replicate remotes of home devices.

This application permit you to host on a RPi a Node.js server with a web app on it. The app offer you an interface to use your smatphone like a remotes to control IR devices.

Note that all this steps must be done on a RPi with the appropriate hardware mounted on it, like [this](https://amzn.to/3uM5LE5) or a DYT circuit that emulate the shield in the link.

# Index

- [RPiremote](#RPiremote)
- [This (cool) index](#Index)
- [Installation](#Installation)
- [Rpi setup](#RPi%20setup)
    - [LIRC](##LIRC)
    - [Overlays](##Overlays)
- [Add new remotes](#Add%20new%20remotes)
    - [Add to LIRC files](##Add%20to%20LIRC%20files)
    - [Add to Database](##Add%20to%20Database)
- [Run application](#Run%20application)

# Installation

after downloading the repository files and extracting them you must first install the npm dependencies:

    cd RPiremote-main
    npm i

After this you need to download and configure LIRC, in case it has already been done you can skip this step and proceed to [register a new remote](#Add%20remote).

# RPi setup

In order for the Raspberry Pi to be able to send and receive infrared signals, it is necessary to make sure that all the settings relating to LIRC and overlays are set correctly.

## LIRC

First of all you need to download LIRC:

    sudo apt-get install lirc

Once it's done you should have a file called _lirc\_option.conf_ into _/etc/lirc_. Open that file:

    sudo nano /etc/lirc/lirc_option.conf


And replace the line:

    driver = devinput

with:

    driver = default

## Overlays

Next step is open the configuration boot file of RPi:

    sudo nano /boot/config.txt

and remove from comment the lines for the IR comunication overlays:

    # Uncomment this to enable infrared communication.
    #dtoverlay=gpio-ir,gpio_pin=17
    #dtoverlay=gpio-ir-tx,gpio_pin=18

you should end up with this:

    # Uncomment this to enable infrared communication.
    dtoverlay=gpio-ir,gpio_pin=17
    dtoverlay=gpio-ir-tx,gpio_pin=18

Then reboot the RPi:

    sudo reboot

# Add new remotes

Since RPiremote does not yet implement the possibility of registering new remote controls directly from the app, and automatically, it is necessary to perform a somewhat triky procedure.
This lack is mainly due to LIRC, which, not being updated since 2017, encounters serious problems in using the **irrecord** command. While some tutorials on how to patch LIRC can be found on the web, such as [this one](https://gist.github.com/billpatrianakos/cb72e984d4730043fe79cbe5fc8f7941), none of them solve the **irrecord** issue.

## Add to LIRC files
To add a remote control file that can be used by LIRC is usually used the **irrecord** command, however, since it does not work out of the box, an alternative must be used.
You should combine **mode2** and **irrecord -a** commands for a satisfying result. Run:

    mode2 -m -d /dev/lirc1 > <REMOTE_NAME>.lircd.conf

while is running point your remote to the IR reciver and press every button ONE single time, in a rememberable order. Once you have finished with your remote Press Ctrl+C to interrupt the command. At this point there's should be a file named _<REMOTE_NAME>.lircd.conf_, open it, assign a name to every sequence of number and then add a proprely preamble.

If you have doubts about how to perform this step you can see how [this](https://devkimchi.com/2020/08/12/turning-raspberry-pi-into-remote-controller/) tutorial does it or look for an example of LIRC files written with raw_codes. Save the file and run:

    irrecord -a <REMOTE_NAME>.lircd.conf

Now copy the converted remote printed on the terminal and past it into the _<REMOTE_NAME>.lircd.conf_ file.

Last but not leat copy the file in the _/etc/lirc/lircd.conf.d_ directory and reboot your RPi:

    sudo cp <REMOTE_NAME>.lircd.conf /etc/lirc/lircd.conf.d
    sudo reboot

Now if you run:

    irsend LIST "" ""

you should see your personal remote in the LIRC list.

## Add to Database

To add your remote to RPiremote Database you must execute this query and then compile the new table with a lirc command for every record.

```
CREATE TABLE '<REMOTE_NAME>' (
	"command"   TEXT NOT NULL UNIQUE,
	"color"	    TEXT NOT NULL,
	"shape"	    TEXT NOT NULL,
	"text"	    TEXT NOT NULL,
	"dimension"	TEXT NOT NULL,
	"row"	    INTEGER NOT NULL,
	PRIMARY KEY("command")
);

INSERT INTO Remotes (id)
VALUES ('<REMOTE_NAME>');
```

command: the same name that you assign previously at IR commmands
color: HTML color of the button
shape: can be a 'circle' or a 'rectangle'
text: can be '' or a personalized text to put inside the button
dimension: can be 'small' or 'large' (reccomanded large)
row: number of button on the same line of this one (MAX 12)

NB: If a button do not show up correctly it's because the button has some invalid parameter entered in the database

# Run application

Finally you can run RPiremote, sit on the sofa and forgot about TV remote.

In the _Rpiremote-master_ directory run:

    node server.js

NB: RPiremote run by default on port 8080 of your RPi, if you want to change port you should change the server.js file

    const port = 8080

with another number of your choice.
