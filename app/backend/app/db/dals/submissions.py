from typing import Type

from app.db.dals.base_dal import BaseDal
from app.db.tables.submissions import Submissions
from app.models.schemas.submissions import InSubmissionSchema, SubmissionSchema

class SubmissionsDal(BaseDal[InSubmissionSchema, SubmissionSchema, Submissions]):
    @property
    def _in_schema(self) -> Type[InSubmissionSchema]:
        return InSubmissionSchema

    @property
    def _schema(self) -> Type[SubmissionSchema]:
        return SubmissionSchema

    @property
    def _table(self) -> Type[Submissions]:
        return Submissions
 