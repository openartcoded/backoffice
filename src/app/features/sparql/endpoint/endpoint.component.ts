import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/service/auth.service';
import { ConfigInitService } from '@init/config-init.service';
import Yasgui from '@triply/yasgui';

const DEFAULT_QUERY = `  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX cv: <http://rdfs.org/resume-rdf/cv.rdfs#>
  PREFIX baseCv: <http://rdfs.org/resume-rdf/base.rdfs#>
  
  CONSTRUCT {?s ?p ?o}
  WHERE {
    graph <https://bittich.be/graphs/public>{
      ?s ?p ?o
    }
  }
`;

@Component({
  selector: 'app-endpoint',
  templateUrl: './endpoint.component.html',
  styleUrls: ['./endpoint.component.scss'],
})
export class EndpointComponent implements OnInit {
  constructor(private configService: ConfigInitService, private authService: AuthService) {}
  token: string;
  async ngOnInit() {
    const element = document?.getElementById('yasgui');
    const endpointUrl = this.configService.getConfig()['SPARQL_ENDPOINT'];
    const defaultQuery = this.configService.getConfig()['SPARQL_DEFAULT_QUERY'] || DEFAULT_QUERY;
    Yasgui.Yasqe.defaults.value = defaultQuery;
    this.authService.tokenRefreshed.subscribe(token => {
      this.token = token;
    });
    this.token = this.authService.token;
    const yasgui = new Yasgui(element, {
      requestConfig: {
        endpoint: endpointUrl,
        defaultGraphs: [],
        method: 'POST',
        headers: () => ({
          Authorization: this.token,
        }),
      },
      autofocus: true,
    });
    yasgui.on('query', (y, tab) => {
      tab.getYasr().on('drawn', async (yasr) => {
        if (yasr.results?.hasError()) {
          const err = yasr.results.getError();
          if (err.status === 403 || err.status === 401) {
            console.error('something went wrong');
          }
        }
      });
    });
  }
}
