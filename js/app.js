//test
$(function(){

	$( '#submit-event' ).click( function( event ){
		event.preventDefault();
		var data = getFormData();
		dbEventSave( data, function( tx, results ){
			console.log( 'saved' );
	  }  );
	  refreshList();
	} );

	$( '#save-as-draft' ).click( function( event ){
		event.preventDefault();
		var data = getFormData();
		dbEventSave( data, function( tx, results ){
			console.log( 'saved' );
	  }  );
	  refreshList();
	} );

	$( '#my-events-wrapper ul li a.edit-event' ).live( 'click', function(event){
		event.preventDefault();
		var id = $(this).parent().attr( 'id' ).replace( /event-id-/, '' );
		dbEventGetOneById( id, function( tx, results ){
      var event = results.rows.item(0);
			$( '[name=event-id]' ).val( event.id )
			$( '[name=event-name]' ).val( event.name )
			$( '[name=event-loc]' ).val( event.location ),
			$( '[name=event-date]' ).val( event.date ),
			$( '[name=event-description]' ).val( event.description ),
			$( '[name=event-price]' ).val( event.price ),
			$( '[name=event-category]' ).val( event.category )
		});
	});

	$( '#my-events-wrapper ul li a.delete-event' ).live( 'click', function(event){
		event.preventDefault();
		dbEventDelete( $(this).parent().attr( 'id' ).replace( /event-id-/, '' ) );
		refreshList();
	});

	$( '#my-events-wrapper ul li a.duplicate-event' ).live( 'click', function(event){
		event.preventDefault();
		var id = $(this).parent().attr( 'id' ).replace( /event-id-/, '' );
		dbEventGetOneById( id, function( tx, results ){
      var event = results.rows.item(0);
			dbEventCreate( event, function(){
				refreshList();
			} );
		});
	});

});

//init db
var db = openDatabase( 'mydb', '1.0', 'my first database', 2 * 1024 * 1024 );
db.transaction(function (tx) 
{
	//tx.executeSql('DROP TABLE IF EXISTS events');
	tx.executeSql('CREATE TABLE IF NOT EXISTS events (' +
		'id INTEGER PRIMARY KEY ASC, ' +
		'name TEXT, ' +
		'location TEXT, ' +
		'date TEXT, ' +
		'description TEXT, ' +
		'price TEXT, ' +
		'category TEXT, ' +
		'modified_at DATETIME, ' +
		'created_at DATETIME);'
		);
});
refreshList();

//db functions
function dbEventDelete( id ){
  db.transaction( function( tx ) {
    tx.executeSql( 'DELETE FROM events WHERE id=?', [ id ]);
  });
}

function dbEventCreate( data, successHandler )
{
	db.transaction( function( tx ) {
		tx.executeSql(
			'INSERT INTO events ' + 
			'(name, location, date, description, price, category) ' +
			'VALUES ' + 
			'(?, ?, ?, ?, ?, ?);',
			[ data.name, data.location, data.date, data.description, data.price, data.category ],
			successHandler
			);
	});
}

function dbEventGetAll( successHandler  )
{
	var results;
	db.transaction( function( tx ) {
		tx.executeSql(
			'SELECT * FROM events',
			[],
			successHandler,
			onDbError
		);
	});
}

function dbEventGetOneById( id, successHandler  )
{
	var results;
	db.transaction( function( tx ) {
		tx.executeSql(
			'SELECT * FROM events WHERE id=?',
			[id],
			successHandler,
			onDbError
		);
	});
}

function dbEventSave( data, successHandler ){
	if( !data.id ) {
		dbEventCreate( data, successHandler );
  } else {
		db.transaction( function( tx ) {
			tx.executeSql(
				'UPDATE events SET name=?, location=?, date=?, description=?, price=?, category=? WHERE id=?;',
				[ data.name, data.location, data.date, data.description, data.price, data.category, data.id ],
				successHandler,
				onDbError
			);
		});
	}
};

function onDbSuccess( tx, results )
{
	console.log( 'success' );
	console.log( results );
}

function onDbError( tx, error )
{
	console.log( 'error' );
	console.log( error.message );
}

//page function
function refreshList()
{
	dbEventGetAll(function( tx, results ){
		var list = $( '#my-events-wrapper ul' );
		$( '#my-events-wrapper ul li' ).remove();
		for ( var i=0; i < results.rows.length; i++ ) {
			list.append(  
				'<li id="event-id-' + results.rows.item( i ).id + '">' +
				results.rows.item( i ).name + 
				'<a class="edit-event" href="">Edit</a>' + 
				'<a class="delete-event" href="">Delete</a>' + 
				'<a class="duplicate-event" href="">Duplicate</a></li>' +
				'</li>'
			);
		}
  });
}

function getFormData()
{
	return {
			'id': 	       $( '[name=event-id]' ).val(),
			'name': 	     $( '[name=event-name]' ).val(),
			'location':    $( '[name=event-loc]' ).val(),
			'date': 	     $( '[name=event-date]' ).val(),
			'description': $( '[name=event-description]' ).val(),
			'price': 			 $( '[name=event-price]' ).val(),
			'category': 	 $( '[name=event-category]' ).val()
		}

}
