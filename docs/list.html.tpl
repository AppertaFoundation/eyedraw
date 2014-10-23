<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Eyedraw Documentation</title>

    <!-- EyeDraw CSS style sheet -->
    <link href="http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/oe-eyedraw.css" type="text/css" media="screen" />

	</head>

	<body>

		<div class="container">
      <div class="row">
        <div class="col-md-12">

					<h1>List of Doodles</h1>
					<table class="table table-striped table-bordered">
						<tr>
							<th>
								Specialty
							</th>
							<th>
								Icon
							</th>
							<th>
								Name
							</th>
						</tr>
						<% _.forEach(doodles, function(doodle) { %>
							<tr>
								<td><%- doodle.specialty %></td>
								<td><span class="icon-ed-<%- doodle.iconName %>"></span></td>	
								<td><%- doodle.description %></td>
							</tr>
						<% });  %>
					</table>
					
				</div>
			</div>
		</div>

	</body>
</html>